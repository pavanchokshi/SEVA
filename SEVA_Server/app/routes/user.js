var express = require('express');
var router = express.Router();
var mongoDB = require('../db/mongoose');
var User = require('../models/user');

// create a user
// POST <servername:port>/api/users
router.post('/', function(req, res) {
    User.find({ 'userName': req.body.userName }, function(err, users) {
        if (err) {
            res.send(err);
        }
        if (users.length > 0) {
            res.status(401).send({ message: "User already exists with same userName." });
        } else {
            var data = req.body;
            data.joinedOn = Date.now();
            var user = new User(req.body);
            user.save(function(err) {
                if (err) {
                    res.send(err);
                }
                res.status(200).send({ message: "User created." });
            });
        }
    });
});

// get all users
// GET <servername:port>/api/users
router.get('/', function(req, res) {
    User.find(function(err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });
});

// get the user with userid
// GET <servername:port>/api/users/userid/:user_id
// router.get('/userid/:user_id', function(req, res) {
//     User.findById(req.params.user_id, function(err, user) {
//         if (err)
//             res.status(404).send({ message: "User not found." });
//         res.json(user);
//     });
// });

// get the user with username
// GET <servername:port>/api/users/username/:username
router.get('/:username', function(req, res) {
    User.find({ 'userName': req.params.username }, { '_id': 0, '__v': 0, 'password': 0 }, function(err, user) {
        if (err)
            res.send(err);
        // if (user.length == 1) {
        res.json(user[0]);
        // }

    });
});

// update the user with username
// PUT <servername:port>/api/users/username/:username
router.put('/:username', function(req, res) {
    User.find({ 'userName': req.params.username }, { '__v': 0, 'password': 0 }, function(err, user) {
        if (err)
            res.send(err);
        console.log(req.body);
        User.findByIdAndUpdate(user[0]._id, { $set: req.body }, { new: true, fields: { 'password': 0, '_id': 0, '__v': 0 } }, function(err, user) {
            if (err) return res.send(err);
            console.log(user)
            res.send(user);
        });
        // user.save(function(err) {
        // if (err)
        //     res.send(err);
        // res.json({ message: 'User updated!' });
        // });
    });
});

// delete the user with this id
// DELETE <servername:port>/api/:username
router.delete('/:username', function(req, res) {
    User.remove({
        userName: req.params.username
    }, function(err, user) {
        if (err)
            res.send(err);

        res.json({ message: 'Successfully deleted' });
    });
});

//add emergency details
// POST <servername:port>/api/:username/emergencydetails
router.post('/:username/emergencydetails', function(req, res) {
    User.find({ 'userName': req.params.username }, function(err, user) {
        if (err)
            res.send(err);
        user[0].emergencyContactDetails.push(req.body);
        console.log(user[0].emergencyContactDetails);
        User.findByIdAndUpdate(user[0]._id, { $set: { emergencyContactDetails: user[0].emergencyContactDetails } }, { new: true, fields: { 'password': 0, '_id': 0, '__v': 0 } }, function(err, user) {
            if (err) return res.send(err);
            res.status(200).send({ message: "Emergency contact added.", data: user });
        });
    });
    // res.status(200).send({ message: "Emrgency Contact added." });
});

//delete emergency details
//DELETE <servername:port>/api/:username/emergencydetails/:contactId
router.delete('/:username/emergencydetails/:contactId', function(req, res) {
    User.find({ 'userName': req.params.username }, function(err, user) {
        if (err)
            res.send(err);
        var details = user[0].emergencyContactDetails.filter(function(obj) {
            return obj._id != req.params.contactId;
        });
        User.findByIdAndUpdate(user[0]._id, { $set: { emergencyContactDetails: details } }, { new: true, fields: { 'password': 0, '_id': 0, '__v': 0 } }, function(err, user) {
            if (err) return res.send(err);
            res.status(200).send({ message: "Emergency contact deleted.", data: user });
        });
    });
});

module.exports = router;