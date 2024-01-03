const Product = require('../models/Product');
const Bead = require('../models/Bead');
const Charm = require('../models/Charm');
const Design = require('../models/Design');
const Shape = require('../models/Shape');

const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
function isValidObjectId(id_val) { return mongoose.Types.ObjectId.isValid(id_val); }


// @desc    Get all products
// @route   GET /products
// @access  Public
const getAllProducts = asyncHandler(async (req, res) => {
    // fetch all products from the DB
    const products = await Product.find();

    // handle the case where no products are found
    if (!products?.length) return res.status(400).json({ message: 'No products found in DB' });

    res.json(products); // send the products back to the client
});


// @desc    Get a product by its id
// @route   GET /products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    // check if product id is valid
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: `No product with id ${req.params.id} found in DB` });

    // fetch the product from the DB
    const product = await Product.findById(req.params.id);

    // handle the case where no product is found
    if (!product) return res.status(400).json({ message: `No product with id ${req.params.id} found in DB` });

    res.json(product); // send the product back to the client
});


// @desc    Create a product
// @route   POST /products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const { is_template, product_type, special_request, base_price, color, name, description,
            img_path, charm_id, beads_id, design_id, shape_id } = req.body; // destructure the request body

    // check if data was sent
    if (is_template===null || !product_type || special_request===null || base_price===null || !color || !name || !description || !img_path) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // check if all special IDs are valid
    if (charm_id && !isValidObjectId(charm_id)) return res.status(400).json({ message: `No charm with id ${charm_id} found in DB` });
    if (beads_id && !isValidObjectId(beads_id)) return res.status(400).json({ message: `No bead with id ${beads_id} found in DB` });
    if (design_id && !isValidObjectId(design_id)) return res.status(400).json({ message: `No design with id ${design_id} found in DB` });
    if (shape_id && !isValidObjectId(shape_id)) return res.status(400).json({ message: `No shape with id ${shape_id} found in DB` });

    // check if special IDs are in DB
    if (charm_id) {
        const charm = await Charm.findById(charm_id).exec();
        if (!charm) return res.status(400).json({ message: `No charm with id ${charm_id} found in DB` });
    }
    if (beads_id) {
        const bead = await Bead.findById(beads_id).exec();
        if (!bead) return res.status(400).json({ message: `No bead with id ${beads_id} found in DB` });
    }
    if (design_id) {
        const design = await Design.findById(design_id).exec();
        if (!design) return res.status(400).json({ message: `No design with id ${design_id} found in DB` });
    }
    if (shape_id) {
        const shape = await Shape.findById(shape_id).exec();
        if (!shape) return res.status(400).json({ message: `No shape with id ${shape_id} found in DB` });
    }

    // create the product object
    const productObject = {
        is_template,
        product_type,
        special_request,
        base_price,
        color,
        name,
        description,
        img_path,
        charm_id: charm_id ? charm_id : null,
        beads_id: beads_id ? beads_id : null,
        design_id: design_id ? design_id : null,
        shape_id: shape_id ? shape_id : null
    };
    const newProduct = await Product.create(productObject);

    // log response and send it to the client
    if (newProduct) res.status(201).json({ message: `Product ${name} created successfully` });
    else res.status(500).json({ message: `Error: Product ${name} could not be created` });
});


// @desc    Update a product
// @route   PATCH /products
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { id, is_template, product_type, special_request, base_price, color, name, description,
            img_path } = req.body; // destructure the request body
    let { charm_id, beads_id, design_id, shape_id } = req.body; // destructure the request body

    // check if data was sent
    if (!id || is_template===null || !product_type || special_request===null || base_price===null || !color || !name || !description || !img_path) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // check if product id is valid
    if (!isValidObjectId(id)) return res.status(400).json({ message: `No product with id ${id} found in DB` });

    // check if all special IDs are valid
    if (charm_id === "remove") charm_id = "r";
    else if (charm_id && !isValidObjectId(charm_id)) return res.status(400).json({ message: `No charm with id ${charm_id} found in DB` });
    if (beads_id === "remove") beads_id = "r";
    else if (beads_id && !isValidObjectId(beads_id)) return res.status(400).json({ message: `No bead with id ${beads_id} found in DB` });
    if (design_id === "remove") design_id = "r";
    else if (design_id && !isValidObjectId(design_id)) return res.status(400).json({ message: `No design with id ${design_id} found in DB` });
    if (shape_id === "remove") shape_id = "r";
    else if (shape_id && !isValidObjectId(shape_id)) return res.status(400).json({ message: `No shape with id ${shape_id} found in DB` });   

    // check if special IDs are in DB
    if (charm_id && charm_id !== "r") {
        const charm = await Charm.findById(charm_id).exec();
        if (!charm) return res.status(400).json({ message: `No charm with id ${charm_id} found in DB` });
    }
    if (beads_id && beads_id !== "r") {
        const bead = await Bead.findById(beads_id).exec();
        if (!bead) return res.status(400).json({ message: `No bead with id ${beads_id} found in DB` });
    }
    if (design_id && design_id !== "r") {
        const design = await Design.findById(design_id).exec();
        if (!design) return res.status(400).json({ message: `No design with id ${design_id} found in DB` });
    }
    if (shape_id && shape_id !== "r") {
        const shape = await Shape.findById(shape_id).exec();
        if (!shape) return res.status(400).json({ message: `No shape with id ${shape_id} found in DB` });
    }

    // check if product exists
    const product = await Product.findById(id).exec();
    if (!product) return res.status(400).json({ message: `No product with id ${id} found in DB` });

    // update the product object
    product.is_template = is_template;
    product.product_type = product_type;
    product.special_request = special_request;
    product.base_price = base_price;
    product.color = color;
    product.name = name;
    product.description = description;
    product.img_path = img_path;
    (charm_id === "r") ? product.charm_id = null : (charm_id ? product.charm_id = charm_id : null);
    (beads_id === "r") ? product.beads_id = null : (beads_id ? product.beads_id = beads_id : null);
    (design_id === "r") ? product.design_id = null : (design_id ? product.design_id = design_id : null);
    (shape_id === "r") ? product.shape_id = null : (shape_id ? product.shape_id = shape_id : null);

    // save the updated product object
    const updatedProduct = await product.save();

    // log response and send it to the client
    if (updatedProduct) res.status(200).json({ message: `Product ${name} updated successfully` });
    else res.status(500).json({ message: `Error: Product ${name} could not be updated` });
});


// @desc    Delete a product
// @route   DELETE /products
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.body; // destructure the request body

    // check if data was sent
    if (!id) return res.status(400).json({ message: 'Please fill in all fields' });

    // check if product id is valid
    if (!isValidObjectId(id)) return res.status(400).json({ message: `No product with id ${id} found in DB` });
    const product = await Product.findById(id).exec();
    if (!product) return res.status(400).json({ message: `No product with id ${id} found in DB` });

    // delete the product from the DB
    const deletedProduct = await product.deleteOne();

    // log response and send it to the client
    if (deletedProduct) res.status(200).json({ message: `Product ${product.name} deleted successfully` });
    else res.status(500).json({ message: `Error: Product ${product.name} could not be deleted` });
});


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};