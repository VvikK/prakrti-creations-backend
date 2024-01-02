const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    is_template: {
        type: Boolean,
        required: true,
        default: false
    },
    product_type: {
        type: String,
        required: true
    },
    base_price: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type:String,
        required: true
    },
    img_path: {
        type: String,
        required: true
    },
    charm_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Charm'
    },
    beads_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Bead'
    },
    design_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Design'
    },
    shape_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Shape'
    }
});

module.exports = mongoose.model('Product', productSchema);