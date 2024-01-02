const mongoose = require('mongoose');

const charmSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
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

module.exports = mongoose.model('Charm', charmSchema);