const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
function isValidObjectId(id_val) { return mongoose.Types.ObjectId.isValid(id_val); }


// @desc    Get all orders
// @route   GET /orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
    // fetch all orders
    const orders = await Order.find();

    // handle the case where there are no orders
    if (!orders?.length) return res.status(404).json({ message: 'No orders found in DB' });

    res.json(orders); // return the orders in JSON format to the client
});


// @desc    Get order by ID
// @route   GET /orders/:id
// @access  Private/Admin
const getOrderById = asyncHandler(async (req, res) => {
    // check if the id is a valid ObjectId
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid order ID' });

    // fetch the order
    const order = await Order.findById(req.params.id);

    // handle the case where the order is not found
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order); // return the order in JSON format to the client
});


// @desc    Create an order
// @route   POST /orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const { customer_id, product_ids } = req.body; // destructure the request body

    // check if data was provided
    if (!customer_id || !product_ids) return res.status(400).json({ message: 'Please provide all required data' });

    // check if the customer_id is a valid ObjectId
    if (!isValidObjectId(customer_id)) return res.status(400).json({ message: 'Invalid customer ID' });
    const customer = await User.findById(customer_id); // fetch the customer
    if (!customer) return res.status(404).json({ message: `Customer id ${customer_id} not found in DB` });

    // check if the product_ids are valid ObjectIds
    for (let i = 0; i < product_ids.length; i++) {
        if (!isValidObjectId(product_ids[i])) return res.status(400).json({ message: `Invalid product ID: ${product_ids[i]}` });
        const product = await Product.findById(product_ids[i]); // fetch the product
        if (!product) return res.status(404).json({ message: `Product id ${product_ids[i]} not found in DB` });
    }

    // create the order and save it to the DB
    const orderObject = {
        customer_id,
        product_ids,
        date: new Date() // set the date to the current date
    };
    const newOrder = await Order.create(orderObject);

    // log response and return it to the client
    if (newOrder) res.status(201).json({ message: `Order for ${customer.first_name} ${customer.last_name} handled successfully` });
    else res.status(400).json({ message: 'Order could not be processed for unknown reasons' });
});


// @desc    Update an order
// @route   PATCH /orders
// @access  Private
const updateOrder = asyncHandler(async (req, res) => {
    const { id, customer_id, product_ids } = req.body; // destructure the request body

    // check if data was provided
    if (!id || !customer_id || !product_ids) return res.status(400).json({ message: 'Please provide all required data' });

    // check if the id is valid
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid order ID' });
    const order = await Order.findById(id); // fetch the order
    if (!order) return res.status(404).json({ message: `Order id ${id} not found in DB` });

    // check if the customer_id is valid
    if (!isValidObjectId(customer_id)) return res.status(400).json({ message: 'Invalid customer ID' });
    const customer = await User.findById(customer_id); // fetch the customer
    if (!customer) return res.status(404).json({ message: `Customer id ${customer_id} not found in DB` });

    // check if the product_ids are valid
    for (let i = 0; i < product_ids.length; i++) {
        if (!isValidObjectId(product_ids[i])) return res.status(400).json({ message: `Invalid product ID: ${product_ids[i]}` });
        const product = await Product.findById(product_ids[i]); // fetch the product
        if (!product) return res.status(404).json({ message: `Product id ${product_ids[i]} not found in DB` });
    }

    // update the order
    order.customer_id = customer_id;
    order.product_ids = product_ids;
    order.date = new Date(); // set the date to the current date

    // save the updated order to the DB
    const updatedOrder = await order.save();

    // log response and return it to the client
    if (updatedOrder) res.json({ message: `Order id ${id} updated successfully` });
    else res.status(400).json({ message: 'Order could not be updated for unknown reasons' });
});


// @desc    Delete an order
// @route   DELETE /orders
// @access  Private
const deleteOrder = asyncHandler(async (req, res) => {
    const { id } = req.body; // destructure the request body

    // check if data was provided
    if (!id) return res.status(400).json({ message: 'Please provide all required data' });

    // check if the id is valid
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid order ID' });
    const order = await Order.findById(id); // fetch the order
    if (!order) return res.status(404).json({ message: `Order id ${id} not found in DB` });

    // delete the order
    const deletedOrder = await order.deleteOne();

    // log response and return it to the client
    if (deletedOrder) res.json({ message: `Order id ${id} deleted successfully` });
    else res.status(400).json({ message: 'Order could not be deleted for unknown reasons' });
});


module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};