require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path')

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
// import connectdb from './Database/connection.js';
const connectdb = require('./Database/connection');
connectdb();

const errorStatus_Detection = require('./Middleware/ErrorStatusHandler.js')
app.use('/PrimaryPathDir', express.static(path.join(__dirname, 'Products', 'PrimaryImages')))
app.use('/SecondaryPathDir', express.static(path.join(__dirname, 'Products', 'SecondaryImages')))
app.use('/inclusionDir', express.static(path.join(__dirname, 'Inclusion')))
app.use('/User_Profile', express.static(path.join(__dirname, 'UserProfile')))
// app.use('')
app.use('/api', require('./Routes/Expressway.js'));
app.use(errorStatus_Detection)


app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
    
})
