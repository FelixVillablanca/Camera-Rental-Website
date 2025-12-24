
const express = require('express')
const Router = express.Router();


//Expressway path two way => /api/Admin <-> /api/Client
Router.use('/Admin', require('./RouterAdmin'))
Router.use('/Client', require('./RouterClient'))

module.exports = Router