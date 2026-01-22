const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// --- 1. Middlewares ---
app.use(express.static('public'));
app.use(express.json()); // Ye line zaroori hai JSON data samajhne ke liye

// --- 2. Auth API Endpoints ---

// User Registration
app.post('/api/register', (req, res) => {
    const { name, email, mobile, pass } = req.body;
    console.log("New Registration Request:", name, email);
    
    // Testing ke liye success message (Kal database aur email add karenge)
    res.json({ 
        success: true, 
        message: Namaste ${name}! Verification link aapki email (${email}) par bhej diya gaya hai. 
    });
});

// User Login
app.post('/api/login', (req, res) => {
    const { id, pass } = req.body;
    if (id && pass) {
        res.json({ success: true, message: "Login Successful!" });
    } else {
        res.json({ success: false, message: "Details adhuri hain!" });
    }
});

// --- 3. Game Logic (Socket.io) ---
io.on('connection', (socket) => {
    console.log('User connected to game');
    // Aapka purana crash logic yahan chalega
});

// --- 4. Server Port Setup ---
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(Server is running live on port ${PORT});
});
