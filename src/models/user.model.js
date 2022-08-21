const mongoose = require("mongoose")
const moment = require("moment")
let Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: String,
        default: moment().format(),
    },
    updatedAt: {
        type: String,
        default: moment().format(),
    },
})

const User = mongoose.model("User", userSchema);
module.exports = User;