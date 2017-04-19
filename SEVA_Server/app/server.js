var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
// var jwt = require('jsonwebtoken');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var port = process.env.PORT || 8000; // set our port
var authenticator = require('./routes/authenticate');
// var verifyToken = require('./routes/verifyToken');
var users = require('./routes/user');
var locations = require('./routes/location');

// REGISTER OUR ROUTES -------------------------------
app.use('/api', authenticator);
// app.use('/api', verifyToken);
//authenticated routes - only accessible if you have valid JWT token
app.use('/api/users', users);
app.use('/api/locations', locations);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);