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
            totReb: '8',
            to: '2'
        };
        const expectedKeys = ['id'].concat(Object.keys(newSheet));

        return chai
            .request(app)
            .post('/api/stats')
            .send(newSheet)
            .then(function (res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.all.keys(expectedKeys);
                expect(res.body.ast).to.equal(newSheet.ast);
                expect(res.body.twoShot).to.equal(newSheet.twoShot);
                expect(res.body.threeShot).to.equal(newSheet.threeShot);
                expect(res.body.ftShot).to.equal(newSheet.ftShot);
                expect(res.body.oReb).to.equal(newSheet.oReb);
                expect(res.body.stl).to.equal(newSheet.stl);
                expect(res.body.twoMade).to.equal(newSheet.twoMade);
                expect(res.body.threeMade).to.equal(newSheet.threeMade);
                expect(res.body.ftMade).to.equal(newSheet.ftMade);
                expect(res.body.dReb).to.equal(newSheet.dReb);
                expect(res.body.blk).to.equal(newSheet.blk);
                expect(res.body.totReb).to.equal(newSheet.totReb);
                expect(res.body.to).to.equal(newSheet.to);
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
                        ast: '8',
                        twoShot: '9',
                        threeShot: '2',
                        ftShot: '2',
                        oReb: '3',
                        stl: '4',
                        twoMade: '9',
                        threeMade: '2',
                        ftMade: '2',
                        dReb: '7',
                        blk: '2',
                        totReb: '10',
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