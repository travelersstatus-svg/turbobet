const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let tempUsers = {}; 

app.post('/api/register-request', (req, res) => {
    const email = req.body.email;
    const otp = Math.floor(100000 + Math.random() * 900000); 
    tempUsers[email] = { ...req.body, otp: otp };
    
    console.log("OTP for " + email + " is: " + otp); 
    res.json({ success: true, message: "OTP sent to " + email });
});

app.post('/api/verify-otp', (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    if (tempUsers[email] && tempUsers[email].otp == otp) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Invalid OTP!" });
    }
});

app.post('/api/login', (req, res) => {
    res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => { console.log("Server Live"); });
