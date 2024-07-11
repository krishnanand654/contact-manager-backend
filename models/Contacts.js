const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const contactSchema = new mongoose.Schema({
    user_id: { type: Schema.Types.ObjectId, required: true }, //id of creating user
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    company: { type: String, required: true },
    phoneNumbers: [{ type: String, required: true }]
})

const Contact = mongoose.model('Contact', contactSchema)

module.exports = Contact



