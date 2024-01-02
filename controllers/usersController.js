const User = require('../models/User');
const Product = require('../models/Product');

const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
function isValidObjectId(id_val) { return mongoose.Types.ObjectId.isValid(id_val); }


// @desc    Get all users
// @route   GET /user
// @access  Private
const getAllUsers = asyncHandler(async (req, res) => {
    // fetch all users from the database excluding their passwords
    const users = await User.find().select('-password').lean();

    // handle the case where no users are found
    if (!users?.length) return res.status(400).json({ message: 'No users found in DB' });

    res.json(users); // send the users back to the client
});


// @desc    Get a user by their id
// @route   GET /user/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
    // check if user id is valid
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: `No user with id ${req.params.id} found in DB` });

    // fetch the user from the database excluding their password
    const user = await User.findById(req.params.id).select('-password').lean();

    // handle the case where no user is found
    if (!user) return res.status(400).json({ message: `No user with id ${req.params.id} found in DB` });

    res.json(user); // send the user back to the client
});


// @desc    Update a user
// @route   PATCH /user
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, password, role, first_name, last_name, email } = req.body; // destructure the request body

    // confirm the data is valid
    if (!id || !username || !role || !first_name || !last_name || !email) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    // check if user to update exists
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user ID' });
    const user = await User.findById(id).exec();
    if (!user) return res.status(400).json({ message: `User ${username} not found in DB` });

    // check if username is being changed to a duplicate
    if (username !== user.username) {
        const duplicate = await User.findOne({ username }).lean().exec();
        if (duplicate) return res.status(409).json({ message: `Username ${username} already exists in DB` });
    }

    // update the user
    user.username = username;
    user.role = role;
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;

    // hash the password if it is being changed and update it in the database
    if (password) user.password = await bcrypt.hash(password, 10);

    // save the updated user
    const updatedUser = await user.save();

    // log response and send it back to the client
    if (updatedUser) res.status(200).json({ message: `User ${username} updated successfully` });
    else res.status(400).json({ message: `User ${username} could not be updated due to an unknown error` });
});


// @desc    Update a user's cart
// @route   PATCH /user/:id
// @access  Private
const updateUserCart = asyncHandler(async (req, res) => {
    const { id } = req.params; // destructure the request params
    const { product_id, action } = req.body; // destructure the request body

    // confirm the data is valid
    if (!id || !product_id || !action) return res.status(400).json({ message: 'Please provide all fields' });

    // check if action is valid
    if (action !== 'add' && action !== 'remove') return res.status(400).json({ message: 'Invalid action; must be either "add" or "remove"' });

    // check if user to update exists
    const user = await User.findById(id).exec();
    if (!user) return res.status(400).json({ message: `User with id ${id} not found in DB` });

    // ensure the productId is valid
    if (!isValidObjectId(product_id)) return res.status(400).json({ message: 'Invalid product ID' });
    const product = await Product.findById(product_id).lean().exec();
    if (!product) return res.status(400).json({ message: `Product with id ${product_id} not found in DB` });

    // add or remove the product from the user's cart
    if(action === 'add') {
        // ensure the product is not already in the user's cart
        const duplicate = user.cart.find(id => id.toString() === product_id.toString());
        if (duplicate) return res.status(409).json({ message: `Product with id ${product_id} already exists in user's cart` });

        // add the product to the user's cart
        user.cart.push(product_id);
    } else {
        // ensure the product is in the user's cart
        const itemToRemove = user.cart.find(id => id.toString() === product_id.toString());
        if (!itemToRemove) return res.status(409).json({ message: `Product with id ${product_id} does not exist in user's cart` });
        
        // remove the product from the user's cart
        user.cart = user.cart.filter(id => id.toString() !== product_id.toString());
    }

    // save the updated user and log response to the client
    const updatedUser = await user.save();
    if (updatedUser) res.status(200).json({ message: `User ${user.username} updated successfully` });
    else res.status(400).json({ message: `User ${user.username} could not be updated due to an unknown error` });
});


// @desc    Delete a user
// @route   DELETE /user
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body; // destructure the request body

    // confirm the data is valid
    if (!id) return res.status(400).json({ message: 'Please provide all fields' });

    // check if user to delete exists
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user ID' });
    const user = await User.findById(id).exec();
    if (!user) return res.status(400).json({ message: `User with ID ${id} not found in DB` });

    // delete the user
    const deletedUser = await user.deleteOne();

    // log response and send it back to the client
    if (deletedUser) res.status(200).json({ message: `User deleted successfully` });
    else res.status(400).json({ message: `User could not be deleted due to an unknown error` });
});


module.exports = {
    getAllUsers,
    getUserById,
    updateUser,
    updateUserCart,
    deleteUser
};