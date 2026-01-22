const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let tempUsers = {}; // OTP temporary storage

// 1. OTP Request
app.post('/api/register-request', (req, res) => {
    const { email, name } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); 
    tempUsers[email] = { ...req.body, otp };
    
    // Yahan mail bhejne ka logic aayega (abhi console pe dikhega)
    console.log("OTP for " + email + " is: " + otp); 
    res.json({ success: true, message: "Code sent to " + email });
});

// 2. OTP Verify
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (tempUsers[email] && tempUsers[email].otp == otp) {
        // Yahan aap Database save logic daal sakte hain
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Invalid OTP!" });
    }
});

app.post('/api/login', (req, res) => {
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => { console.log("Server Running"); });
