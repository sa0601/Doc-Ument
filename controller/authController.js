const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const Patient = require('../models/patient.js');
const Doctor = require('../models/doctor.js');

router.get('/login', (req, res) => {
    res.render("auth/login")
});

router.post("/login", async (req, res) => {
    console.log(req.body);

    let docToLogin = await Doctor.findOne({ username: req.body.username });

    if (!docToLogin) {
        console.log("Username not found");
        return res.send("Username not found");
    } 

    bcrypt.compare(req.body.password, docToLogin.password, async (err, result) => {
        if (err) {
            console.error("Error during bcrypt comparison:", err);
            return res.status(500).send("Internal Server Error");
        }

        if (result) {
            req.session.userId = docToLogin._id;
            req.session.name = docToLogin.name;
            req.session.doctor = docToLogin;

            const patients = await Patient.find();
            return res.render("dashboard", { Doctor: docToLogin, patients: patients });
        } else {
            console.log("Incorrect Password");
            return res.send("Incorrect Password");
        }
    });
});


router.post("/signup", async (req, res) => {
    console.log(req.body);

    if(req.body.username && req.body.password){
        let plainTextPassword = req.body.password
        bcrypt. hash(plainTextPassword, 10, async (err, hashedPassword) => {
            req.body.password = hashedPassword;
            let newUser = await Doctor.create(req.body);
            res.redirect("/");
        })
    } else {
       res.send("You are missing a username or password");
    }
});

router.get('/signup', (req, res) => {
    res.render('auth/signup');
});

router.get('/logout', (req, res) => {
    req.session.destroy(); 
    res.redirect('/'); 
});

module.exports = router;