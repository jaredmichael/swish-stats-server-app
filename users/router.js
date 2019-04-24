'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const {User} = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
    console.log(req.body);
    const requiredFields = [
        'username', 
        'password', 
        'firstName', 
        'lastName',
        'jerseyNum',
        'age',
        'height',
        'position'
    ];
    const missingField = requiredFields.find(field => !(field in req.body));

    if (missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        });
    }

    const stringFields = [
        'username', 
        'password',
        'firstName',
        'lastName',
        'height',
        'position' 
    ];
    const nonStringField = stringFields.find(
        field => field in req.body && typeof req.body[field] !== 'string'
    );

    if (nonStringField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Incorrect field type: expected text string',
            location: nonStringField
        });
    }

    const numberFields = ['jerseyNum', 'age'];
    const nonNumberField = numberFields.find(
        field => field in req.body && typeof req.body[field] !== 'number'
    );

    if (nonNumberField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Incorrect field type: expected number',
            location: nonNumberField
        });
    }

    const explicitlyTrimmedFields = ['username', 'password'];
    const nonTrimmedField = explicitlyTrimmedFields.find(
        field => req.body[field].trim() !== req.body[field]
    );

    if(nonTrimmedField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Cannot start or end with whitespace',
            location: nonTrimmedField
        });
    }
    const sizedFields = {
        username: {
            min: 1,
            max: 20
        },
        password: {
            min: 8,
            max: 72
        }
    };
    const tooSmallField = Object.keys(sizedFields).find(
        field =>
            'min' in sizedFields[field] && 
                req.body[field].trim().length < sizedFields[field].min
    );
    const tooLargeField = Object.keys(sizedFields).find(
        field =>
            'max' in sizedFields[field] &&
                req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField
                ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
                : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
            location: tooSmallField || tooLargeField
        });
    }

    let {username, password, firstName = '', lastName = '', jerseyNum = '', age = '', height = '', position = ''} = req.body;
    firstName = firstName.trim();
    lastName = lastName.trim();

    return User.find({username})
        .count()
        .then(count => {
            if (count > 0) {
                // There is an existing user with the same username
                return Promise.reject({
                    code: 422,
                    reason: 'ValidationError',
                    message: 'Username already taken',
                    location: 'username'
                });
            }
            // If no existing user, hash the password
            return User.hashPassword(password);
        })
        .then(hash => {
            return User.create({
                username,
                password: hash,
                firstName,
                lastName, 
                jerseyNum,
                age,
                height,
                position
            });
        })
        .then(user => {
            return res.status(201).json(user.serialize());
        })
        .catch(err => {
            console.log(err);
            // Forward validation errors to client, else give 500 error for something unexpected
            if (err.reason === 'ValidationError') {
                return res.status(err.code).json(err);
            }
            res.status(500).json({code: 500, message: 'Internal server error'});
        });
});

module.exports = {router};