const mongoose = require("mongoose")

const keySchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    user: String,
    access_token: String,
    refresh_token: String
})

module.exports = mongoose.model('Key', keySchema)