const mongoose = require('mongoose');

const timerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    duration: {
        type: Number, // in minutes
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});

const Timer = mongoose.model('Timer', timerSchema);

module.exports = Timer;