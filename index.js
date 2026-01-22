const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let tempUsers = {}; // Temporary storage for OTP verification

// Registration - Step 1: Send OTP
app.post('/api/register-request', (req, res) => {
    const { name, email, mobile, pass } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // 6 Digit OTP
    tempUsers[email] = { name, mobile, pass, otp };
    
    console.log("OTP for " + email + " is: " + otp); // Testing ke liye console pe dikhega
    res.json({ success: true, message: "Verification code sent to " + email });
});

// Registration - Step 2: Verify OTP
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (tempUsers[email] && tempUsers[email].otp == otp) {
        // Yahan user permanent save hoga (Database logic)
        delete tempUsers[email];
        res.json({ success: true, message: "Registration Successful! Now Login." });
    } else {
        res.json({ success: false, message: "Invalid OTP!" });
    }
});

app.post('/api/login', (req, res) => {
    res.json({ success: true, message: "Login Successful" });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => { console.log("Server Live on " + PORT); });
