const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static('public'));

let multiplier = 1.00;
let isCrashed = false;
let gameStatus = "waiting"; // waiting, flying
let nextCrashPoint = null; // Admin control variable

function startNewRound() {
    multiplier = 1.00;
    isCrashed = false;
    gameStatus = "flying";
    
    // logic: Agar admin ne set kiya hai toh wahi point, 
    // nahi toh random point (10% chance to crash at 1.00x for profit)
    let houseEdgeTrigger = Math.random() < 0.10; 
    let crashPoint = nextCrashPoint || (houseEdgeTrigger ? 1.00 : (1 + Math.pow(Math.random(), 2) * 15).toFixed(2));
    
    // Next point use hone ke baad reset kar dein
    nextCrashPoint = null;

    console.log(`Round Started. Target Crash: ${crashPoint}x`);

    let interval = setInterval(() => {
        if (multiplier >= parseFloat(crashPoint)) {
            isCrashed = true;
            gameStatus = "waiting";
            io.emit('crash', multiplier.toFixed(2));
            clearInterval(interval);
            setTimeout(startNewRound, 5000); // 5 second break before next round
        } else {
            // Multiplier speed logic
            let increment = multiplier < 2 ? 0.01 : (multiplier * 0.02);
            multiplier += increment;
            io.emit('tick', multiplier.toFixed(2));
        }
    }, 100);
}

// Secret Admin Route: Isse aap mobile se crash point control karenge
// Example: your-link.com/control/1.5
app.get('/control/:point', (req, res) => {
    let p = parseFloat(req.params.point);
    if(p >= 1.00) {
        nextCrashPoint = p;
        res.send(`<h1>Admin Command Received</h1><p>Next round will crash exactly at: <b>${p}x</b></p>`);
    } else {
        res.send("Invalid Point. Use 1.00 or higher.");
    }
});

io.on('connection', (socket) => {
    socket.emit('initialState', { multiplier, gameStatus });
});

// Port setting for Render
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => { 
    console.log('TurboBet Server Live'); 
    startNewRound(); 
});
