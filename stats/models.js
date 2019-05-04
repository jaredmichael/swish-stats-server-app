'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const statSheetSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},

    date: { 
        type: Date, 
        required: true, 
        default: '' 
    },
    vs: { 
        type: String, 
        required: true, 
        default: '' 
    },
    ast: { 
        type: Number,
        default: '' 
    },
    twoShot: { 
        type: Number,
        default: '' 
    },
    threeShot: { 
        type: Number,
        default: '' 
    },
    ftShot: { 
        type: Number,
        default: '' 
    },
    oReb: { 
        type: Number,
        default: '' 
    },
    stl: { 
        type: Number,
        default: '' 
    },
    twoMade: { 
        type: Number,
        default: '' 
    },
    threeMade: { 
        type: Number,
        default: '' 
    },
    ftMade: { 
        type: Number,
        default: '' 
    },
    dReb: { 
        type: Number,
        default: '' 
    },
    blk: { 
        type: Number,
        default: '' 
    },
    totReb: { 
        type: Number,
        default: '' 
    },
    to: { 
        type: Number,
        default: '' 
    }
})

statSheetSchema.methods.serialize = function () {
    return {
        statsId: this._id,
        date: this.date || '',
        vs: this.vs || '',
        ast: this.ast || '',
        twoShot: this.twoShot || '',
        threeShot: this.threeShot || '',
        ftShot: this.ftShot || '',
        oReb: this.oReb || '',
        stl: this.stl || '',
        twoMade: this.twoMade || '',
        threeMade: this.threeMade || '',
        ftMade: this.ftMade || '',
        dReb: this.dReb || '',
        blk: this.blk || '',
        points: this.points || '',
        twoPer: this.twoPer || '',
        threePer: this.threePer || '',
        ftPer: this.ftPer || '',
        totReb: this.totReb || '',
        to: this.to || '',
    }
}

const StatSheet = mongoose.model('StatSheet', statSheetSchema);

module.exports = { StatSheet }