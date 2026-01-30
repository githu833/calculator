const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const Calculation = require('./models/Calculation');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging for production debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Production Paths (Absolute resolution)
const distPath = path.resolve(__dirname, '..', 'frontend', 'dist');

// Static Files serving
app.use(express.static(distPath));

// MongoDB Connection with Demo Mode Fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/interestCalculator';
let memoryHistory = [];
let isDemoMode = false;

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        isDemoMode = true;
        console.error('❌ MongoDB Connection Error:', err.message);
        console.log('⚠️ Entering DEMO MODE (In-Memory). History will reset on restart.');
    });

// API Routes
app.get('/api/ping', (req, res) => res.json({
    status: 'active',
    demoMode: isDemoMode,
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
}));

app.post('/api/calculate', async (req, res, next) => {
    try {
        const { principal, rate, time, interestType } = req.body;
        const p = parseFloat(principal);
        const r = parseFloat(rate);
        const t = parseFloat(time);

        if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r <= 0 || t <= 0) {
            return res.status(400).json({ error: 'Values must be valid positive numbers.' });
        }

        let interest = 0;
        if (interestType === 'simple') interest = (p * r * t) / 100;
        else interest = p * Math.pow((1 + r / 100), t) - p;

        const result = {
            principal: p,
            rate: r,
            time: t,
            interestType,
            interestAmount: Number(interest.toFixed(2)),
            totalAmount: Number((p + interest).toFixed(2)),
            createdAt: new Date()
        };

        if (!isDemoMode && mongoose.connection.readyState === 1) {
            const saved = await new Calculation(result).save();
            res.status(201).json(saved);
        } else {
            const demoResult = { ...result, _id: 'demo_' + Date.now() };
            memoryHistory.unshift(demoResult);
            res.status(201).json(demoResult);
        }
    } catch (err) { next(err); }
});

app.get('/api/history', async (req, res, next) => {
    try {
        if (!isDemoMode && mongoose.connection.readyState === 1) {
            const history = await Calculation.find().sort({ createdAt: -1 });
            return res.json(history);
        }
        res.json(memoryHistory);
    } catch (err) {
        console.error('❌ History Fetch Error:', err.message);
        res.json(memoryHistory);
    }
});

// SPA Fallback - MUST BE AFTER API ROUTES
// This handles client-side routing and serves index.html for unknown routes
app.use((req, res, next) => {
    if (req.url.startsWith('/api')) return res.status(404).json({ error: 'API route not found' });
    res.sendFile(path.join(distPath, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('🔥 Server Error:', err.stack);
    res.status(500).json({ error: 'Internal server error occurred.' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
    console.log(`📡 Serving static files from: ${distPath}`);
});
