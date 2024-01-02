const mongoose = require('mongoose');

const beadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    color: {
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

module.exports = mongoose.model('Bead', beadSchema);