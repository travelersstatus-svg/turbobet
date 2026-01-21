const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static('public'));

let multiplier = 1.00;
let isCrashed = false;
let gameStatus = "waiting"; // waiting, flying

function startNewRound() {
    multiplier = 1.00;
    isCrashed = false;
    gameStatus = "flying";
    
    // Admin Profit Logic: 10% rounds will crash at 1.00x
    let houseEdgeTrigger = Math.random() < 0.10; 
    let crashPoint = houseEdgeTrigger ? 1.00 : (1 + Math.pow(Math.random(), 2) * 10).toFixed(2);

    let interval = setInterval(() => {
        if (multiplier >= crashPoint) {
            isCrashed = true;
            gameStatus = "waiting";
            io.emit('crash', multiplier.toFixed(2));
            clearInterval(interval);
            setTimeout(startNewRound, 5000); // 5 sec break
        } else {
            multiplier += 0.01 * (multiplier < 2 ? 1 : multiplier * 0.5);
            io.emit('tick', multiplier.toFixed(2));
        }
    }, 100);
}

io.on('connection', (socket) => {
    socket.emit('initialState', { multiplier, gameStatus });
});

http.listen(3000, () => { console.log('TurboBet Live on Port 3000'); startNewRound(); });

