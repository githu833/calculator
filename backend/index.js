const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Calculation = require('./models/Calculation');

const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/interestCalculator';

// In-Memory Fallback Storage
let memoryHistory = [];
let isDemoMode = false;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        isDemoMode = true;
        console.error('❌ MongoDB Connection Failed. Entering DEMO MODE (In-Memory).');
        console.log('Calculation history will be lost on server restart.');
        console.log('To persistence fix: Ensure MongoDB service is running.');
    }
};
connectDB();

// Routes
app.post('/api/calculate', async (req, res, next) => {
    try {
        console.log('📥 Calculation Request:', req.body);
        const { principal, rate, time, interestType } = req.body;

        const p = parseFloat(principal);
        const r = parseFloat(rate);
        const t = parseFloat(time);

        if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) {
            console.log('⚠️ Validation Failed:', { p, r, t });
            return res.status(400).json({ error: 'Values must be valid positive numbers.' });
        }

        let interestAmount = 0;
        if (interestType === 'simple') {
            interestAmount = (p * r * t) / 100;
        } else if (interestType === 'compound') {
            interestAmount = p * Math.pow((1 + r / 100), t) - p;
        } else {
            return res.status(400).json({ error: 'Invalid interest model.' });
        }

        let resultData;
        const interestFixed = parseFloat(interestAmount.toFixed(2));
        const totalFixed = parseFloat((p + interestAmount).toFixed(2));

        // Effective Demo Mode if not connected
        const effectiveDemo = isDemoMode || mongoose.connection.readyState !== 1;

        if (effectiveDemo) {
            resultData = {
                _id: 'auto_' + Math.random().toString(36).substr(2, 9),
                principal: p,
                rate: r,
                time: t,
                interestType,
                interestAmount: interestFixed,
                totalAmount: totalFixed,
                createdAt: new Date()
            };
            memoryHistory.unshift(resultData);
            console.log('💾 Handled in Demo Mode (Memory)');
        } else {
            const newCalculation = new Calculation({
                principal: p,
                rate: r,
                time: t,
                interestType,
                interestAmount: interestFixed,
                totalAmount: totalFixed
            });
            await newCalculation.save();
            resultData = newCalculation;
            console.log('💾 Saved to MongoDB');
        }

        res.status(201).json(resultData);
    } catch (err) {
        console.error('❌ Calculation Error:', err);
        next(err);
    }
});



app.get('/api/history', async (req, res, next) => {
    try {
        const effectiveDemo = isDemoMode || mongoose.connection.readyState !== 1;

        if (effectiveDemo) {
            return res.json(memoryHistory);
        }
        const history = await Calculation.find().sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        console.error('❌ History Fetch Error:', err.message);
        res.json(memoryHistory); // Safe fallback
    }
});



// Global Error Handler
app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err.stack);
    res.status(500).json({
        error: 'An internal server error occurred.',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Fallback to React App for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server active on port ${PORT}`);
    console.log(`📡 API Endpoints ready at http://localhost:${PORT}/api`);
});

