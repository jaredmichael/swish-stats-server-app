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
        required: true,  
        default: '' 
    },
    twoShot: { 
        type: Number,
        required: true,  
        default: '' 
    },
    threeShot: { 
        type: Number,
        required: true,  
        default: '' 
    },
    ftShot: { 
        type: Number,
        required: true,  
        default: '' 
    },
    oReb: { 
        type: Number,
        required: true,  
        default: '' 
    },
    stl: { 
        type: Number,
        required: true,  
        default: '' 
    },
    twoMade: { 
        type: Number,
        required: true,  
        default: '' 
    },
    threeMade: { 
        type: Number,
        required: true,  
        default: '' 
    },
    ftMade: { 
        type: Number,
        required: true,  
        default: '' 
    },
    dReb: { 
        type: Number,
        required: true,  
        default: '' 
    },
    blk: { 
        type: Number,
        required: true,  
        default: '' 
    },
    totReb: { 
        type: Number,
        required: true,  
        default: '' 
    },
    to: { 
        type: Number,
        required: true,  
        default: '' 
    }
})

statSheetSchema.methods.serialize = function () {
    return {
        id: this._id,
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