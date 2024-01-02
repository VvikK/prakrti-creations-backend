const Design = require('../models/Design');

const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
function isValidObjectId(id_val) { return mongoose.Types.ObjectId.isValid(id_val); }


// @desc    Get all designs
// @route   GET /design
// @access  Public
const getAllDesigns = asyncHandler(async (req, res) => {
    // fetch all designs from the DB
    const designs = await Design.find();

    // handle the case where no designs are found
    if (!designs?.length) return res.status(400).json({ message: 'No designs found in DB' });

    res.json(designs); // send the designs back to the client
});


// @desc    Get a design by its id
// @route   GET /design/:id
// @access  Public
const getDesignById = asyncHandler(async (req, res) => {
    // check if design id is valid
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: `No design with id ${req.params.id} found in DB` });

    // fetch the design from the DB
    const design = await Design.findById(req.params.id);

    // handle the case where no design is found
    if (!design) return res.status(400).json({ message: `No design with id ${req.params.id} found in DB` });

    res.json(design); // send the design back to the client
});


// @desc    Create a design
// @route   POST /design
// @access  Private/Admin
const createDesign = asyncHandler(async (req, res) => {
    const { name, description, img_path } = req.body; // destructure the request body

    // check if data was sent
    if (!name || !description || !img_path) return res.status(400).json({ message: 'Please fill in all fields' });

    // create the design and send it to the DB
    const designObject = {
        name,
        description,
        img_path
    };
    const newDesign = await Design.create(designObject);

    // log response and send it to the client
    if (newDesign) res.status(201).json({ message: `Design ${name} created successfully` });
    else res.status(500).json({ message: `Error: Design ${name} could not be created` });
});


// @desc    Update a design
// @route   PATCH /design
// @access  Private/Admin
const updateDesign = asyncHandler(async (req, res) => {
    const { id, name, description, img_path } = req.body; // destructure the request body

    // check if data was sent
    if (!id || !name || !description || !img_path) return res.status(400).json({ message: 'Please fill in all fields' });

    // check if design id is valid
    if (!isValidObjectId(id)) return res.status(400).json({ message: `No design with id ${id} found in DB` });
    const design = await Design.findById(id).exec();
    if (!design) return res.status(400).json({ message: `No design with id ${id} found in DB` });

    // update the design
    design.name = name;
    design.description = description;
    design.img_path = img_path;
    
    // send it to the DB
    updatedDesign = await design.save();

    // log response and send it to the client
    if (updatedDesign) res.status(201).json({ message: `Design ${name} updated successfully` });
    else res.status(500).json({ message: `Error: Design ${name} could not be updated` });
});


// @desc    Delete a design
// @route   DELETE /design
// @access  Private/Admin
const deleteDesign = asyncHandler(async (req, res) => {
    const { id } = req.body; // destructure the request body

    // check if data was sent
    if (!id) return res.status(400).json({ message: 'Please fill in all fields' });

    // check if design id is valid
    if (!isValidObjectId(id)) return res.status(400).json({ message: `No design with id ${id} found in DB` });
    const design = await Design.findById(id).exec();
    if (!design) return res.status(400).json({ message: `No design with id ${id} found in DB` });

    // delete the design
    const deletedDesign = await design.deleteOne();

    // log response and send it to the client
    if (deletedDesign) res.status(201).json({ message: `Design ${design.name} deleted successfully` });
    else res.status(500).json({ message: `Error: Design ${design.name} could not be deleted` });
});


module.exports = {
    getAllDesigns,
    getDesignById,
    createDesign,
    updateDesign,
    deleteDesign
};