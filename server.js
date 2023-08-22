require("dotenv").config()
const express = require("express");
const app = express();
const PORT = 3000;
const Patient = require('./models/patient.js');
// const Doctor = require('./models/doctor.js');
const expressEjsLayouts = require("express-ejs-layouts");
const authRoutes = require('./controller/authController.js');
const session = require("express-session");
const Doctor = require('./models/doctor.js');
const methodOverride = require('method-override');
const cors = require("cors");
const bcrypt = require("bcrypt");
const ptLoginController = require('./controller/ptLoginController.js');



app.set('view engine', 'ejs');

//MIDDLEWARE
app.use(cors());
app.use(expressEjsLayouts); 
app.use(express.urlencoded({ extended: true})); 
app.use(session({ secret: 'somestringrandomdwd', cookie: {maxAge: 3600000 }}));
app.use(express.json()); //allows us to to create key/values in Postman in an object forman in the "raw" section - DOUBLE QUOTES MUST BE USED FOR JSON
app.use(express.static("public"));
app.use(methodOverride('_method'));


//INDEX - First
app.get("/", (req, res) => {
    res.render('home.ejs');
});


//This route will be used after Doctor logs in
app.get('/patients', async (req, res) => {
    const patients = await Patient.find();
    res.render('ptlist', {patients: patients});
})

//NEW
app.get("/newpt", async (req, res) => {
    res.render('newpt.ejs')
})

//DELETE
app.delete("/delete-patient/:id", async (req, res) => {
    
    const id = req.params.id;
    await Patient.findByIdAndRemove(id)
    res.redirect('/patients');
    });

//UPDATE
  app.post("/edit-patient/:id", async (req, res) => {
    const id = req.params.id
    req.body.bloodWork = req.body.bloodWork ? "Done" : "Not Done";
    req.body.xRay = req.body.xRay ? "Done" : "Not Done";
    req.body.mRI = req.body.mRI ? "Done" : "Not Done";
    req.body.cT = req.body.cT ? "Done" : "Not Done";

    await Patient.findByIdAndUpdate(id, req.body);

    res.redirect("/patients");
});

//CREATE (POST) - Second

app.post("/newpt", async (req, res) => {
    console.log(req.body);

    req.body.bloodWork = req.body.bloodWork ? "Done" : "Not Done";
    req.body.xRay = req.body.xRay ? "Done" : "Not Done";
    req.body.mRI = req.body.mRI ? "Done" : "Not Done";
    req.body.cT = req.body.cT ? "Done" : "Not Done";

    let newPatient = await Patient.create(req.body);
    res.redirect('/patients');
});


//EDIT
app.get("/edit-patient/:id", async (req, res) => {
    const id = req.params.id;
    const patient = await Patient.findById(id);
    if (patient) {
        res.render('editpt', { patient: patient });
    } else {
        res.send('Patient not found');
    }
});


//SHOW
app.get("/dashboard", async (req, res) => {
    if (req.session && req.session.doctor) {
        const patients = await Patient.find();
        res.render("dashboard", { Doctor: req.session.doctor, patients: patients });
    } else {
        res.redirect("/login");
    }
});

app.get("/ptview/:pID", async (req, res) => {
    const pID = req.params.pID;


    let patientData = await Patient.findOne({ pID: pID });

    if (patientData) {
        res.render("ptview", { patient: patientData });
    } else {
        res.status(404).send("Patient not found");
    }
});


// app.get('/app.js', (req, res) => {
//     res.sendFile(__dirname + '/public/app.js');
// });





app.use(authRoutes);
app.use(ptLoginController);

//Catch all route (make it the last route defined in the heirarchy)
app.get('/*', (req, res) => {
    res.send('404, page not found');
});

app.listen(PORT, (req, res) => {
    console.log(`"PORT ${PORT}, up and running!`)
});