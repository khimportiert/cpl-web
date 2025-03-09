const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    login_name: {
        type: String,
        maxLength: 100,
        required: true,
        immutable: true
    },
    username: {
        type: String,
        maxLength: 100,
    },
    firstname: {
        type: String,
        maxLength: 100,
    },
    lastname: {
        type: String,
        maxLength: 100,
    },
    password: {
        type: String,
        maxLength: 100,
        required: true,
        immutable: true
    },
    roles: {
        type: [String],
        default: ['4305'],
        immutable: true
    },
    allowed_stations: {
        type: [String]
    },
    refreshToken: {
        type: String,
        maxLength: 200,
    },
},
{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)