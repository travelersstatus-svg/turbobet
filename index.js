const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let nextCrashPoint = null;

// Admin Approval: link.com/approve-deposit/500
app.get('/approve-deposit/:amount', (req, res) => {
    let amt = parseFloat(req.params.amount);
    let bonus = amt * 0.10; // 10% Bonus
    io.emit('depositApproved', { amount: amt, bonus: bonus });
    res.send(`Approved: ${amt} + ${bonus} Bonus`);
});

app.get('/control/:point', (req, res) => {
    nextCrashPoint = parseFloat(req.params.point);
    res.send("Next Crash: " + nextCrashPoint);
});

// Yahan aapka game loop (startRound) rahega...
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => { console.log('Server Live'); });
