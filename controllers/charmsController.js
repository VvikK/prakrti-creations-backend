const Charm = require('../models/Charm');

const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
function isValidObjectId(id_val) { return mongoose.Types.ObjectId.isValid(id_val); }


// @desc    Get all charms
// @route   GET /charm
// @access  Public
const getAllCharms = asyncHandler(async (req, res) => {
    // fetch all charms from the DB
    const charms = await Charm.find();

    // handle the case where no charms are found
    if (!charms?.length) return res.status(400).json({ message: 'No charms found in DB' });

    res.json(charms); // send the charms back to the client
});


// @desc    Get a charm by its id
// @route   GET /charm/:id
// @access  Public
const getCharmById = asyncHandler(async (req, res) => {
    // check if charm id is valid
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: `No charm with id ${req.params.id} found in DB` });

    // fetch the charm from the DB
    const charm = await Charm.findById(req.params.id);

    // handle the case where no charm is found
    if (!charm) return res.status(400).json({ message: `No charm with id ${req.params.id} found in DB` });

    res.json(charm); // send the charm back to the client
});


// @desc    Create a charm
// @route   POST /charm
// @access  Private/Admin
const createCharm = asyncHandler(async (req, res) => {
    const { name, price, description, img_path } = req.body; // destructure the request body

    // check if data was sent
    if (!name || !price || !description || !img_path) return res.status(400).json({ message: 'Please fill in all fields' });

    // create the charm and send it to the DB
    const charmObject = {
        name,
        price,
        description,
        img_path
    };
    const newCharm = await Charm.create(charmObject);

    // log response and send it to the client
    if (newCharm) res.status(201).json({ message: `Charm ${name} created successfully` });
    else res.status(500).json({ message: `Error: Charm ${name} could not be created` });
});


// @desc    Update a charm
// @route   PATCH /charm
// @access  Private/Admin
const updateCharm = asyncHandler(async (req, res) => {
    const { id, name, price, description, img_path } = req.body; // destructure the request body

    // confirm the data is valid
    if (!id || !name || !price || !description || !img_path) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    // check if charm to update exists
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid charm ID' });
    const charm = await Charm.findById(id).exec();
    if (!charm) return res.status(400).json({ message: `Charm with id ${id} not found in DB` });

    // update the charm
    charm.name = name;
    charm.price = price;
    charm.description = description;
    charm.img_path = img_path;

    // save the updated charm
    const updatedCharm = await charm.save();

    // log response and send it back to the client
    if (updatedCharm) res.status(200).json({ message: `Charm ${name} updated successfully` });
    else res.status(400).json({ message: `Charm ${name} could not be updated due to an unknown error` });
});


// @desc    Delete a charm
// @route   DELETE /charm
// @access  Private/Admin
const deleteCharm = asyncHandler(async (req, res) => {
    const { id } = req.body; // destructure the request body

    // check if charm to delete exists
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid charm ID' });
    const charm = await Charm.findById(id).exec();
    if (!charm) return res.status(400).json({ message: `Charm with id ${id} not found in DB` });

    // delete the charm
    const deletedCharm = await charm.deleteOne();

    // log response and send it back to the client
    if (deletedCharm) res.status(200).json({ message: `Charm ${charm.name} deleted successfully` });
    else res.status(400).json({ message: `Charm ${charm.name} could not be deleted due to an unknown error` });
});


module.exports = {
    getAllCharms,
    getCharmById,
    createCharm,
    updateCharm,
    deleteCharm
};