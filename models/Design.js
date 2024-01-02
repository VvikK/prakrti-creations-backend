const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    img_path: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Design', designSchema);