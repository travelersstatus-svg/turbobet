const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let tempUsers = {}; 

app.post('/api/register-request', (req, res) => {
    const { email, name, mobile, pass } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); 
    tempUsers[email] = { name, mobile, pass, otp: otp };
    
    console.log("OTP for " + email + " is: " + otp); 
    // Abhi yeh OTP sirf Render logs mein dikhega. Email ke liye Nodemailer chahiye hoga.
    res.json({ success: true, message: "OTP sent! Check server logs." });
});

app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (tempUsers[email] && tempUsers[email].otp == otp) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Invalid OTP!" });
    }
});

app.post('/api/login', (req, res) => {
    const { email, pass } = req.body;
    // Yahan check karein ki user registered hai ya nahi
    if (tempUsers[email] && tempUsers[email].pass === pass) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Invalid Credentials or Not Registered!" });
    }
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => { console.log("Server Live on port " + PORT); });
