const mongoose =    require('mongoose');
const Schema =      mongoose.Schema;
const passwordLocalMongoose = require('passport-local-mongoose');

const opts = { toJSON: { virtuals: true } }

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name cannot be blank'],
    },
    username: {
        type: String,
        required: [true, 'Username cannot be blank'],
        unique: true,
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

// UserSchema.pre('save', async function(next) { // TODO a parallel with passport
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 12);
//     next();
// })

UserSchema.plugin(passwordLocalMongoose);

module.exports = mongoose.model('User', UserSchema)