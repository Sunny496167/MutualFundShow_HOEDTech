const mongoose = require('mongoose');

const savedFundsSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    schemeName: {
        type: String,
        required: true,
        trim: true
    },
    schemeCode: {
        type: String,
        required: true,
        trim: true
    },
    fundType: {
        type: String,
        required: true,
        enum: ['EQUITY', 'DEBT', 'HYBRID', 'OTHER'],
        default: 'OTHER'
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    amc: {
        type: String,
        required: true,
        trim: true
    },
    notes: {
        type: String,
        trim: true,
        default: '',
        maxlength: 500
    }
});

savedFundsSchema.pre('save', function(next){
    if(!this.amc && this.schemeName){
        this.amc = this.schemeName.split(' ')[0];
    }
    next();
})

const SavedFunds = mongoose.model('SavedFunds', savedFundsSchema);
module.exports = SavedFunds;