
require('dotenv').config();
const mongoose = require('mongoose');


const connectdb = () => {
    try {
        mongoose.connect(process.env.MongodbConnection)
        console.log(` `);
        console.log("Successfully Connected to Lily'sDigitalCameraRentalsDB")
    } catch (error) {
        console.error(error)
    }
}

module.exports = connectdb
