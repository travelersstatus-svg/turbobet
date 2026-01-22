const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Isme registration ka data save hoga
let tempUsers = {}; 

app.post('/api/register-request', (req, res) => {
    const { email, pass } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); 
    tempUsers[email] = { pass: pass, otp: otp }; // Data save ho raha hai
    console.log("OTP for " + email + " is: " + otp); 
    res.json({ success: true, message: "OTP sent! Check server logs." });
});

app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (tempUsers[email] && tempUsers[email].otp == otp) {
        tempUsers[email].verified = true;
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Invalid OTP!" });
    }
});

app.post('/api/login', (req, res) => {
    const { email, pass } = req.body;
    // Yahan check ho raha hai ki user ne register kiya hai ya nahi
    if (tempUsers[email] && tempUsers[email].pass === pass && tempUsers[email].verified) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Pehle Register karein ya galat password!" });
    }
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => { console.log("Server Live on " + PORT); });
