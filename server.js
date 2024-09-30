require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet'); // Ensure helmet is installed
const rateLimit = require('express-rate-limit'); // Ensure express-rate-limit is installed
const connectDB = require('./pomodoro-lofi-app/backend/config/db'); // Correct path to db.js

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'pomodoro-lofi-app/frontend'))); // Serve static files from the nested frontend directory
app.use(helmet()); // Add security headers
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // Rate limiting

console.log("Current directory:", __dirname); // Log current directory

const timerRoutes = require('./pomodoro-lofi-app/backend/routes/timerRoutes'); // Correct path to timerRoutes.js

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pomodoro-lofi-app/frontend', 'index.html')); // Serve the index.html file
});

app.use('/api', timerRoutes);

// 404 Route Handler
app.use((req, res, next) => {
    res.status(404).send('Route not found');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});