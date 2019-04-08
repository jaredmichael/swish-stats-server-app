'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const expect = chai.expect;

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users/models')

chai.use(chaiHttp);

describe('Stat Sheets', function () {
    const username = 'exampleUser';
    const password = 'examplePass';

    before(function () {
        return runServer();
    });
    after(function () {
        return closeServer();
    });

    beforeEach(function () {
        return User.hashPassword(password).then(password =>
            User.create({
                username,
                password
            })
        );
    });

    afterEach(function () {
        return User.remove({});
    });

    it('Should list stats on GET', function () {
        const token = jwt.sign(
            {
                username,
            },
            JWT_SECRET,
            {
                algorithm: 'HS256',
                expiresIn: '7d'
            }
        );

        return chai
            .request(app)
            .get('/api/stats')
            .set('Authorization', `Bearer ${token}`)
            .then(function (res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                res.body.forEach(function (item) {
                    expect(item).to.be.a('object');
                    expect(item).to.have.all.keys(
                        'id',
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
                    );
                });
            });
    });

    it('should add a new sheet on POST', function () {
        const newSheet = {
            date: '',
            vs: 'Bulls',
            ast: '5',
            twoShot: '12',
            threeShot: '4',
            ftShot: '6',
            oReb: '3',
            stl: '2',
            twoMade: '9',
            threeMade: '2',
            ftMade: '6',
            dReb: '5',
            blk: '0',
            twoPer: '.75',
            threePer: '.50',
            ftPer: '100',
            totReb: '8',
            to: '2'
        };
        const expectedKeys = ['id'].concat(Object.keys(newPost));

        return chai
            .request(app)
            .post('/api/stats')
            .send(newPost)
            .then(function (res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.all.keys(expectedKeys);
                expect(res.body.date).to.equal(newPost.date);
                expect(res.body.vs).to.equal(newPost.vs);
                expect(res.body.ast).to.equal(newPost.ast);
                expect(res.body.twoShot).to.equal(newPost.twoShot);
                expect(res.body.threeShot).to.equal(newPost.threeShot);
                expect(res.body.ftShot).to.equal(newPost.ftShot);
                expect(res.body.oReb).to.equal(newPost.oReb);
                expect(res.body.stl).to.equal(newPost.stl);
                expect(res.body.twoMade).to.equal(newPost.twoMade);
                expect(res.body.threeMade).to.equal(newPost.threeMade);
                expect(res.body.ftMade).to.equal(newPost.ftMade);
                expect(res.body.dReb).to.equal(newPost.dReb);
                expect(res.body.blk).to.equal(newPost.blk);
                expect(res.body.twoPer).to.equal(newPost.twoPer);
                expect(res.body.threePer).to.equal(newPost.threePer);
                expect(res.body.ftPer).to.equal(newPost.ftPer);
                expect(res.body.totReb).to.equal(newPost.totReb);
                expect(res.body.to).to.equal(newPost.to);
            });
    });

    it('Should error if POST is missing expected values', function () {
        const badRequestData = {};
        return chai
            .reques(app)
            .post('/api/stats')
            .send(badRequestData)
            .then(function (res) {
                expect(res).to.have.status(400);
            });
    });

    it('Should update stat sheet on PUT', function () {
        return (
            chai
                .request(app)
                .get('/api/stats')
                .then(function (res) {
                    const updatedStat = Object.assign(res.body[0], {
                        date: '',
                        vs: 'Warriors',
                        ast: '5',
                        twoShot: '12',
                        threeShot: '4',
                        ftShot: '6',
                        oReb: '3',
                        stl: '2',
                        twoMade: '9',
                        threeMade: '2',
                        ftMade: '6',
                        dReb: '5',
                        blk: '0',
                        twoPer: '.75',
                        threePer: '.50',
                        ftPer: '100',
                        totReb: '8',
                        to: '2'
                    });
                    return chai
                        .request(app)
                        .put(`/api/stats/${res.body[0].id}`)
                        .send(updatedStat)
                        .then(function (res) {
                            expect(res).to.have.status(204);
                        });
                })
        );
    });

    it('Should delete stats on DELETE', function () {
        return (
            chai
                .request(app)
                .get('/api/stats')
                .then(function (res) {
                    return chai
                        .request(app)
                        .delete(`/api/stats/${res.body[0].id}`)
                        .then(function (res) {
                            expect(res).to.have.status(204);
                        });
                })
        );
    });

    it('Should add new stat sheet on POST', function () {
        const newUser = {
            username: 'testNewUser',
            password: 'testPassword'
        };
        const expectedKeys = ['id'].concat(Object.keys(newUser));

        return chai
            .request(app)
            .post('/api/users')
            .send(newUser)
            .then(function (res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.all.keys(expectedKeys);
                expect(res.body.username).to.equal(newUser.username);
                expect(res.body.password).to.equal(newUser.password);
            });
    });
});