//bring in mongoose thats connected to our db
const mongoose = require('../database/connection.js');

const docSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
});


const Doctor = new mongoose.model('Doctor', docSchema);

module.exports = Doctor;