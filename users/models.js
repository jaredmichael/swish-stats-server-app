'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        default: ''
    },
    lastName: {
        type: String,
        required: true,
        default: ''
    },
    jerseyNum: {
        type: Number,
        required: true,
        default: ''
    },
    age: {
        type: Number,
        required: true,
        default: ''
    },
    height: {
        type: String,
        required: true,
        default: ''
    },
    position: {
        type: String,
        required: true,
        default: ''
    }
});

UserSchema.methods.serialize = function() {
    return {
        username: this.username || '',
        firstName: this.firstName || '',
        lastName: this.lastName || '',
        jerseyNum: this.jerseyNum || '',
        age: this.age || '',
        height: this.height || '',
        position: this.position || ''
    };
};

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};