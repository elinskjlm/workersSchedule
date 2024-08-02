const mongoose =    require('mongoose');
const bcrypt =      require('bcryptjs');
const Schema =      mongoose.Schema;

const opts = { toJSON: { virtuals: true } }

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name cannot be blank'],
    },
    username: {
        type: String,
        required: [true, 'Username cannot be blank'],
    },
    hashedPassword: {
        type: String,
        required: [true, 'Password cannot be blank'],
    },
    roll: {
        type: String,
        enum: ['dev', 'admin', 'inspector'],
    },
    created: Date,
    lastLogged: Date,
    lastModified: Date,
}, opts)

UserSchema.virtual('shortId').get(function() {
    return `${this._id.toString().slice(-5)}...`
})

UserSchema.virtual('createdDate').get(function() {
    return `${this.created?.getDate().toString().padStart(2, '0')}/${(this.created?.getMonth()+1).toString().padStart(2, '0')}/${this.created?.getFullYear().toString().slice(-2)}`
})

UserSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username });
    const isValid = await bcrypt.compare(password, foundUser.hashedPassword);
    return isValid ? foundUser : false;
}

module.exports = mongoose.model('User', UserSchema)