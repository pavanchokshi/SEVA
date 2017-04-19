var User = require('../models/user');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config');
var app = express();
app.set('superSecret', config.secret);

router.post('/authenticate', function(req, res) {
    if (req.body.userName && req.body.password) {
        User.find({ 'userName': req.body.userName }, function(err, user) {
            if (err)
                res.send(err);
            if (user.length == 1) {
                if (user[0].password == req.body.password) {
                    //res.status(200).send({ message: "User authenticated." });
                    // create a token
                    var token = jwt.sign(user[0], app.get('superSecret'), {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(200).send({
                        message: 'Success: User authenticated !',
                        token: token
                    });
                } else
                    res.status(404).send({ message: "Authentication Error: Invalid password." });

            } else {
                res.status(404).send({ message: "Authentication Error: Invalid username." });
            }
        });
    } else {
        res.status(400).send({ message: "Invalid request." });
    }
});

router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }

});

module.exports = router;