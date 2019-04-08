'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const { StatSheet } = require ('./models');

const router = express.Router();

const passport = require('passport');
const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', { session: false });

router.get('/', jwtAuth, (req, res) => {
    StatSheet  
        .find({
            userId: req.user.id 
        })
        .then(stats => {
            res.json({
                stats: stats.map(
                    (stats) => stats.serialize())
            });
        })
        .catch(err => {
            res.status(500).json({ message: 'Internal server error' });
        });
});

router.get('/:id', jwtAuth, (req, res) => {
    StatSheet  
        .findById(req.params.id)
        .then(stat => {
            res.json(
                stat.serialize() 
            );
        })
        .catch(err => {
            res.status(500).json({ message: 'Internal server error' });
        });
});

router.post('/', jwtAuth, jsonParser, (req, res) => {
    const requiredFields = [
        'date', 
        'vs', 
        'ast', 
        'twoShot', 
        'threeShot', 
        'ftShot', 
        'oReb', 
        'stl', 
        'twoMade', 
        'threeMade', 
        'ftMade', 
        'dReb', 
        'blk', 
        'twoPer', 
        'threePer', 
        'ftPer', 
        'totReb', 
        'to'
    ];
    for (let i =0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            return res.status(400).send(message);
        }
    }

    StatSheet
        .create({
            date: req.body.date,
            vs: req.body.vs,
            ast: req.body.ast,
            twoShot: req.body.twoShot,
            threeShot: req.body.threeShot,
            ftShot: req.body.ftShot,
            oReb: req.body.oReb,
            stl: req.body.stl,
            twoMade: req.body.twoMade,
            threeMade: req.body.threeMade,
            ftMade: req.body.ftMade,
            dReb: req.body.dReb,
            blk: req.body.blk,
            twoPer: req.body.twoPer,
            threePer: req.body.threePer,
            ftPer: req.body.ftPer,
            totReb: req.body.totReb,
            to: req.body.to,
            userId: req.user.id
        })
        .then(stat => res.status(201).json(stat.serialize()))
        .catch(err => {
            res.status(500).json({ message: 'Internal server error' });
        });
});

router.put('/:id', jwtAuth, jsonParser, (req, res) => {
    const toUpdate = {};
    const updateableFields = [
        'date', 
        'vs', 
        'ast', 
        'twoShot', 
        'threeShot', 
        'ftShot', 
        'oReb', 
        'stl', 
        'twoMade', 
        'threeMade', 
        'ftMade', 
        'dReb', 
        'blk', 
        'twoPer', 
        'threePer', 
        'ftPer', 
        'totReb', 
        'to'
    ];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });

    StatSheet
        .findByIdAndUpdate(req.params.id, { $set: toUpdate })
        .then(goal => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.delete('/:id', (req,res) => {
    StatSheet
        .findByIdAndRemove(req.params.id)
        .then(sheet => res.status(204).end())
        .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.use('*', function (req, res) {
    res.status(404).json({ message: 'Not Found'});
});

module.exports = { router };