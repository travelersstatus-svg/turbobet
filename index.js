const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// --- 1. Middlewares ---
app.use(express.static('public'));
app.use(express.json()); 

// --- 2. Auth API Endpoints ---
app.post('/api/register', (req, res) => {
    const { name, email } = req.body;
    console.log("New User:", name);
    // Yahan Backticks (`) ka sahi use kiya gaya hai
    res.json({ 
        success: true, 
        message: "Hi " + name + "! Verification link sent to " + email 
    });
});

app.post('/api/login', (req, res) => {
    res.json({ success: true, message: "Login Successful!" });
});

// --- 3. Game Logic ---
io.on('connection', (socket) => {
    console.log('User connected');
});

// --- 4. Server Start ---
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log('Server is live on port ' + PORT);
});
