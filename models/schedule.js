const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } }

const DaySchema = new Schema({
    morning: {
        reg: {
            type: Boolean,
            default: false
        },
        ot1: {
            type: Boolean,
            default: false
        }
    },
    noon: {
        reg: {
            type: Boolean,
            default: false
        }
    },
    night: {
        reg: {
            type: Boolean,
            default: false
        },
        ot1: {
            type: Boolean,
            default: false
        },
        ot2: {
            type: Boolean,
            default: false
        }
    },
}, { _id : false })


const ScheduleSchema = new Schema({
    timeSubmitted: {
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
    name: {
        type: String,
        required: [true, `Field 'name' is missing in this entry: id: ${this._id}`]
    },
    schedule: {
        day1: { type: DaySchema, required: true },
        day2: { type: DaySchema, required: true },
        day3: { type: DaySchema, required: true },
        day4: { type: DaySchema, required: true },
        day5: { type: DaySchema, required: true },
        day6: { type: DaySchema, required: true },
        day7: { type: DaySchema, required: true }
    },
    comment: {
        type: String,
        maxLength: [250, 'Comment max length is 250.']
    },
    toIgnore: {
        type: Boolean,
        default: false
    },
    wasSeen: {
        type: Boolean,
        default: false
    },
    isOpen: {
        type: Boolean,
        default: true
    }
}, opts)

ScheduleSchema.virtual('shortId').get(function() {
    return `${this._id?.toString().slice(-5)}...`
})

ScheduleSchema.virtual('dateDay').get(function() {
    return `${this.timeSubmitted?.getDate().toString().padStart(2, '0')}/${(this.timeSubmitted?.getMonth()+1).toString().padStart(2, '0')}`
})

ScheduleSchema.virtual('dateHour').get(function() {
    return `${this.timeSubmitted?.getHours().toString().padStart(2, '0')}:${this.timeSubmitted?.getMinutes().toString().padStart(2, '0')}`
})

module.exports = mongoose.model('Schedule', ScheduleSchema);