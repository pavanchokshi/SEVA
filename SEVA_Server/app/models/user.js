var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    userName: String,
    password: String,
    firstName: String,
    lastName: String,
    dob: Date,
    gender: String,
    address1: String,
    address2: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
    emergencyContactDetails: [{
        firstName: String,
        lastName: String
            // address1: String,
            // address2: String,
            // city: String,
            // state: String,
            // zip: String,
            // phone: String,
            // relationship: String,
    }],
    isAdmin: Boolean,
    isVolunteer: Boolean,
    joinedOn: Date
});

module.exports = mongoose.model('User', UserSchema);