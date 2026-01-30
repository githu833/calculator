const mongoose = require('mongoose');

const CalculationSchema = new mongoose.Schema({
    principal: { type: Number, required: true },
    rate: { type: Number, required: true },
    time: { type: Number, required: true },
    interestType: { type: String, enum: ['simple', 'compound'], required: true },
    interestAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Calculation', CalculationSchema);
