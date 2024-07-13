const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { weeknumToDates } = require('../utils/weekDate');

const opts = { toJSON: { virtuals: true } }

const FormSchema = new Schema({
    timeCreated: {
        type: Date,
        required: [true, `Field 'date' is missing in this entry: id: ${this._id}`]
    },
    weekNum: {
        type: Number,
        min: [1, 'weekNum minimum: 1.'],
        max: [53, 'weekNum maximum: 53.'],
        required: [true, `Field 'weekNum' is missing in this entry: id: ${this._id}`]
    },
    year: {
        type: Number,
        min: [2020, 'year minimum: 2020.'],
        max: [2120, 'year maximum: 2120.'],
        required: [true, `Field 'year' is missing in this entry: id: ${this._id}`]
    },
    isLive: {
        type: Boolean,
        default: false
    },
}, opts)

FormSchema.virtual('dates').get(function() {
    return weeknumToDates(this.year, this.weekNum)
})

FormSchema.virtual('shortId').get(function() {
    return `${this._id.toString().slice(-5)}...`
})

module.exports = mongoose.model('Form', FormSchema);