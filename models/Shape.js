const mongoose = require('mongoose');

const shapeSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Shape', shapeSchema);