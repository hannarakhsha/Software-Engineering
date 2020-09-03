// app.js
var express = require('express');
var app = express();
var db = require('./db');

var RiderController = require('./Rider/RiderController');
app.use('/rider', RiderController);

var DriverController = require('./Driver/DriverController');
app.use('/driver', DriverController);

var AdminController = require('./Admin/AdminController');
app.use('/admin', AdminController);

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


module.exports = app;