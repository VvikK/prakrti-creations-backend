const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    product_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    }],
    date: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema);