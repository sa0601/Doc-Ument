//require mongoose to tell it which database to connect to
require("dotenv").config()
const mongoose = require('mongoose');
//Get the url from mongodbatlas or you can also use a local installed mongodb database

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


//Set up a console message to let us know we (un)successfully connected to MongoDB
mongoose.connection.on("connected", () => {
    console.log("We are connected to MongoDB");
})
mongoose.connection.on("error", err => {
    console.log("ERROR:", err);
});

module.exports = mongoose;