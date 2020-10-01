const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    name: String,
    tickets: Array,
    thumbnail: String,
    subscribe: Boolean
})

const User = mongoose.model('traveler',UserSchema)

module.exports = User