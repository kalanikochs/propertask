const mongoose = require('mongoose');
const { Schema } = mongoose;

const Task = new Schema({
    title: String,
    description: String,
    priority: String,
    start_date: String,
    end_date: String,
    email: String
})

module.exports = mongoose.model('Task', Task);