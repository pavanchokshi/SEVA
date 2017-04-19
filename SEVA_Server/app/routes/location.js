var express = require('express');
var router = express.Router();
var mongoDB = require('../db/mongoose');
var Location = require('../models/location');


router.post('/', function(req, res) {
    var location = new Location();
    location.userName = req.body.userName;
    location.loc = [req.body.lng, req.body.lat];
    location.save(function(err) {
        if (err)
            res.send(err);
        res.json({ message: 'Location added.' });
    });
});

router.get('/', function(req, res) {
    Location.find(function(err, locations) {
        if (err)
            res.send(err);
        res.json(locations);
    });
});

router.get('/nearBy/:lat/:lng/:maxDist', function(req, res) {
    var limit = req.query.limit || 10;
    var maxDistance = req.params.maxDist;
    //filter volunteer

    // we need to convert the distance to radians
    // the raduis of Earth is approximately 6371 kilometers
    maxDistance /= 6371;
    // get coordinates [ <longitude> , <latitude> ]
    var coords = [];
    coords[0] = req.params.lng;
    coords[1] = req.params.lat;
    Location.find({
        loc: {
            $near: coords,
            $maxDistance: maxDistance
        }
    }, { '__v': 0, '_id': 0 }).limit(limit).exec(function(err, locations) {
        if (err) {
            return res.json(500, err);
        }
        res.json(200, locations);
    });
});

module.exports = router;