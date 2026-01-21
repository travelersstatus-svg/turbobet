const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let multiplier = 1.00;
let nextCrashPoint = null;

function startNewRound() {
    multiplier = 1.00;
    let houseEdge = Math.random() < 0.15; 
    let crashPoint = nextCrashPoint || (houseEdge ? 1.00 : (1 + Math.pow(Math.random(), 2) * 15).toFixed(2));
    nextCrashPoint = null;

    let interval = setInterval(() => {
        if (multiplier >= parseFloat(crashPoint)) {
            io.emit('crash', multiplier.toFixed(2));
            clearInterval(interval);
            setTimeout(startNewRound, 5000);
        } else {
            multiplier += 0.01 * (multiplier < 2 ? 1 : multiplier * 0.5);
            io.emit('tick', multiplier.toFixed(2));
        }
    }, 100);
}

// Admin Control: Agla crash set karne ke liye
app.get('/control/:point', (req, res) => {
    nextCrashPoint = parseFloat(req.params.point);
    res.send("<h1>Crash Set to " + nextCrashPoint + "x</h1>");
});

// Admin Deposit: Is link se aap user ka balance badhayenge
// Example: link.com/approve-deposit/1000
app.get('/approve-deposit/:amount', (req, res) => {
    let baseAmount = parseFloat(req.params.amount);
    let bonus = baseAmount * 0.10; // 10% Bonus
    let total = baseAmount + bonus;
    io.emit('depositApproved', { amount: baseAmount, bonus: bonus });
    res.send(`<h1>Deposit Approved!</h1><p>Base: ${baseAmount} + Bonus: ${bonus} = Total: ${total}</p>`);
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => { startNewRound(); });
