const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// --- MIDDLEWARES ---
app.use(express.static('public'));
app.use(express.json()); 

// --- AUTH API ENDPOINTS ---

// 1. Registration API
app.post('/api/register', (req, res) => {
    const { name, email } = req.body;
    console.log("New Registration Attempt:", name, email);
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

// --- GAME LOGIC (Purana Logic) ---
let nextCrashPoint = null;

io.on('connection', (socket) => {
    console.log('A user connected');
    // Aapka purana socket logic yahan rahega
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(Server running on port ${PORT});
});
