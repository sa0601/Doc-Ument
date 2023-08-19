const mongoose = require("../database/connection");
const { Schema } = mongoose;

const ptSchema = new Schema ({
    //defne each key for our models
    name: String,
    dateOfBirth: Date,
    reasonOfVisit: String,
    insurance: String,
    bloodWork: Boolean,
    xRay: Boolean,
    mRI: Boolean,
    cT: Boolean
});

const Patient = mongoose.model("Patient", ptSchema);

module.exports = Patient;