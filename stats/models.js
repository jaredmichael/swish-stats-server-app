'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const statSheetSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    vs: { type: String, required: true },
    ast: { type: Number, required: true },
    twoShot: { type: Number, required: true },
    threeShot: { type: Number, required: true },
    ftShot: { type: Number, required: true },
    oReb: { type: Number, required: true },
    stl: { type: Number, required: true },
    twoMade: { type: Number, required: true },
    threeMade: { type: Number, required: true },
    ftMade: { type: Number, required: true },
    dReb: { type: Number, required: true },
    blk: { type: Number, required: true },
    twoPer: { type: Number, required: true },
    threePer: { type: Number, required: true },
    ftPer: { type: Number, required: true },
    totReb: { type: Number, required: true },
    to: { type: Number, required: true }
})

statSheetSchema.methods.serialize = function () {
    return {
        id: this._id,
        date: this.date,
        vs: this.vs,
        ast: this.ast,
        twoShot: this.twoShot,
        threeShot: this.threeShot,
        ftShot: this.ftShot,
        oReb: this.oReb,
        stl: this.stl,
        twoMade: this.twoMade,
        threeMade: this.threeMade,
        ftMade: this.ftMade,
        dReb: this.dReb,
        blk: this.blk,
        twoPer: this.twoPer,
        threePer: this.threePer,
        ftPer: this.ftPer,
        totReb: this.totReb,
        to: this.to,
    }
}

const StatSheet = mongoose.model('StatSheet', statSheetSchema);

module.exports = { StatSheet }