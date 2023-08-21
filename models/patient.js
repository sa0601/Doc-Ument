const mongoose = require("../database/connection");
const { Schema } = mongoose;

const ptSchema = new Schema ({
    //defne each key for our models
    pID: String,
    name: String,
    dateOfBirth: String,
    reasonOfVisit: String,
    insurance: String,
    bloodWork: String,
    xRay: String,
    mRI: String,
    cT: String
});

const Patient = mongoose.model("Patient", ptSchema);

module.exports = Patient;