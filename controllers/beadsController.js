const Bead = require('../models/Bead');

const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
function isValidObjectId(id_val) { return mongoose.Types.ObjectId.isValid(id_val); }


// @desc    Get all beads
// @route   GET /beads
// @access  Public
const getAllBeads = asyncHandler(async (req, res) => {
    // fetch all beads
    const beads = await Bead.find({});

    // handle the case where there are no beads
    if (!beads?.length) return res.status(404).json({ message: 'No beads found in DB' });

    res.json(beads); // send the beads
});


// @desc    Get bead by ID
// @route   GET /beads/:id
// @access  Public
const getBeadById = asyncHandler(async (req, res) => {
    // fetch bead by ID
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: `No bead with id ${req.params.id} found in DB` });
    const bead = await Bead.findById(req.params.id).lean();

    // handle the case where there is no bead
    if (!bead) return res.status(400).json({ message: `No bead with id ${req.params.id} found in DB` });

    res.json(bead); // send the bead
});


// @desc    Create a bead
// @route   POST /beads
// @access  Private/Admin
const createBead = asyncHandler(async (req, res) => {
    const { name, color, description, img_path } = req.body; // destructure the request body

    // confirm data was sent
    if (!name || !color || !description || !img_path) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // create the bead and send it to the DB
    const beadObject = {
        name,
        color,
        description,
        img_path
    };
    const newBead = await Bead.create(beadObject);

    // log response and send it to the client
    if (newBead) res.status(201).json({ message: `Bead ${name} created successfully` });
    else res.status(500).json({ message: `Error: Bead ${name} could not be created` });
});


// @desc    Update a bead
// @route   PATCH /beads
// @access  Private/Admin
const updateBead = asyncHandler(async (req, res) => {
    const { id, name, color, description, img_path } = req.body; // destructure the request body

    // confirm data was sent
    if (!id || !name || !color || !description || !img_path) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // check if bead to update exists
    if (!isValidObjectId(id)) return res.status(400).json({ message: `No bead with id ${id} found in DB` });
    const bead = await Bead.findById(id).exec();
    if (!bead) return res.status(400).json({ message: `No bead with id ${id} found in DB` });

    // update the bead
    bead.name = name;
    bead.color = color;
    bead.description = description;
    bead.img_path = img_path;

    // save the updated bead to the DB
    const updatedBead = await bead.save();

    // log response and send it to the client
    if (updatedBead) res.status(200).json({ message: `Bead ${name} updated successfully` });
    else res.status(500).json({ message: `Error: Bead ${name} could not be updated` });
});


// @desc    Delete a bead
// @route   DELETE /beads
// @access  Private/Admin
const deleteBead = asyncHandler(async (req, res) => {
    const { id } = req.body; // destructure the request body

    // confirm data was sent
    if (!id) return res.status(400).json({ message: 'Please provide all required fields' });

    // check if bead to delete exists
    if (!isValidObjectId(id)) return res.status(400).json({ message: `No bead with id ${id} found in DB` });
    const bead = await Bead.findById(id).exec();
    if (!bead) return res.status(400).json({ message: `No bead with id ${id} found in DB` });

    // delete the bead
    const deletedBead = await bead.deleteOne();

    // log response and send it to the client
    if (deletedBead) res.status(200).json({ message: `Bead ${bead.name} deleted successfully` });
    else res.status(500).json({ message: `Error: Bead ${bead.name} could not be deleted` });
});


module.exports = {
    getAllBeads,
    getBeadById,
    createBead,
    updateBead,
    deleteBead
};