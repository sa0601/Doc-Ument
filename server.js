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


app.set('view engine', 'ejs');

//MIDDLEWARE
app.use(expressEjsLayouts); //looks for a file named Layout.ejs
app.use(express.urlencoded({ extended: true})); //allows form data -- posts from Postman will populate in console instead of showing as "undefined"
app.use(session({ secret: 'somestringrandomdwd', cookie: {maxAge: 3600000 }}));
app.use(express.json()); //allows us to to create key/values in Postman in an object forman in the "raw" section - DOUBLE QUOTES MUST BE USED FOR JSON
app.use(express.static("public"));

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


//DELETE

//UPDATE

//CREATE (POST) - Second
app.post("/newpt", async (req, res) => {
    //
    const createdPatient = await Patient.create(req.body);
    res.send(createdPatient);
})

//EDIT


// app.get('/app.js', (req, res) => {
//     res.sendFile(__dirname + '/public/app.js');
// });


app.use(authRoutes);

//Catch all route (make it the last route defined in the heirarchy)
app.get('/*', (req, res) => {
    res.send('404, page not found');
});

app.listen(PORT, (req, res) => {
    console.log(`"PORT ${PORT}, up and running!`)
});