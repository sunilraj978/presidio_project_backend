const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buyerSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName:{type: String, required: true},
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phoneNumber:{type: String, required: true}
});

const Buyer = mongoose.model("Buyer", buyerSchema);
module.exports = Buyer;
