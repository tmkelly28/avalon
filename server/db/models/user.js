'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    email: {
        type: String
    },
    picture: {
        type: String
    },
    google: {
        id: String
    },
    displayName: {
        type: String
    }
});

mongoose.model('User', schema);
