const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CodeSchema = new Schema({
    accessCode: {
        type: String,
        required: [true, `Access code must not be empty.`],
        unique: true,
    },
})

module.exports = mongoose.model('Code', CodeSchema);