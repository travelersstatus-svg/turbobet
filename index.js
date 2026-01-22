const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// --- MIDDLEWARES ---
app.use(express.static('public'));
app.use(express.json()); // JSON data receive karne ke liye zaroori hai

// --- AUTH API ENDPOINTS ---

// 1. Registration API
app.post('/api/register', (req, res) => {
    const { name, email } = req.body;
    console.log("Naya User:", name, email);
    res.json({ 
        success: true, 
        message: Namaste ${name}! Verification link aapki email (${email}) par bhej diya gaya hai. 
    });
});

// 2. Login API
app.post('/api/login', (req, res) => {
    const { id, pass } = req.body;
    if (id && pass) {
        res.json({ success: true, message: "Login Successful!" });
    } else {
        res.json({ success: false, message: "Details bhariye!" });
    }
});

// --- GAME LOGIC (Socket.io) ---
io.on('connection', (socket) => {
    console.log('A user connected');
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(Server running on port ${PORT});
});
