const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Ptlogin = require('../models/ptLogin.js'); 


router.get("/ptlogin-form", (req, res) => {
    res.render('auth/ptlogin');
});


router.post("/patient-login", async (req, res) => {
    const { username, password } = req.body;
    const patient = await Ptlogin.findOne({ username });

    if (patient && await bcrypt.compare(password, patient.password)) {
        req.session.patient = patient;
        res.redirect("/patient-dashboard");
    } else {
        res.send("Invalid Patient username or password");
    }
});


router.get("/patient-dashboard", (req, res) => {
    if (req.session && req.session.patient) {
        res.redirect(`/ptview/${req.session.patient.pID}`);
    } else {
        res.redirect("/ptlogin-form");
    }
});


router.get("/ptsignup", (req, res) => {
    res.render('auth/ptsignup');
});

router.post("/ptsignup", async (req, res) => {
    console.log(req.body);

    if (req.body.pID && req.body.name && req.body.username && req.body.password) {
        let plainTextPassword = req.body.password;

        bcrypt.hash(plainTextPassword, 10, async (err, hashedPassword) => {
            if (err) {
                res.send("Error hashing the password");
                return;
            }

            req.body.password = hashedPassword;
            let newUser = await Ptlogin.create(req.body);
            res.redirect("/");
        });
    } else {
        res.send("You are missing required fields.");
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(); 
    res.redirect('/'); 
});

module.exports = router;

