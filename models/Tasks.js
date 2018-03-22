const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const TaskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});
mongoose.model('Tasks', TaskSchema);