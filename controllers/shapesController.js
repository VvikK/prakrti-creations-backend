const Shape = require('../models/Shape');

const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
function isValidObjectId(id_val) { return mongoose.Types.ObjectId.isValid(id_val); }


// @desc    Get all shapes
// @route   GET /shapes
// @access  Public
const getAllShapes = asyncHandler(async (req, res) => {
    // fetch all shapes from the DB
    const shapes = await Shape.find();

    // handle the case where no shapes are found
    if (!shapes?.length) return res.status(400).json({ message: 'No shapes found in DB' });

    res.json(shapes); // send the shapes back to the client
});


// @desc    Get a shape by its id
// @route   GET /shapes/:id
// @access  Public
const getShapeById = asyncHandler(async (req, res) => {
    // check if shape id is valid
    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: `No shape with id ${req.params.id} found in DB` });

    // fetch the shape from the DB
    const shape = await Shape.findById(req.params.id);

    // handle the case where no shape is found
    if (!shape) return res.status(400).json({ message: `No shape with id ${req.params.id} found in DB` });

    res.json(shape); // send the shape back to the client
});


// @desc    Create a shape
// @route   POST /shapes
// @access  Private/Admin
const createShape = asyncHandler(async (req, res) => {
    const { name, description, img_path } = req.body; // destructure the request body

    // check if data was sent
    if (!name || !description || !img_path) return res.status(400).json({ message: 'Please fill in all fields' });

    // create the shape and send it to the DB
    const shapeObject = {
        name,
        description,
        img_path
    };
    const newShape = await Shape.create(shapeObject);

    // log response and send it to the client
    if (newShape) res.status(201).json({ message: `Shape ${name} created successfully` });
    else res.status(500).json({ message: `Error: Shape ${name} could not be created` });
});


// @desc    Update a shape
// @route   PATCH /shapes
// @access  Private/Admin
const updateShape = asyncHandler(async (req, res) => {
    const { id, name, description, img_path } = req.body; // destructure the request body

    // check if data was sent
    if (!id || !name || !description || !img_path) return res.status(400).json({ message: 'Please fill in all fields' });

    // check if shape id is valid
    if (!isValidObjectId(id)) return res.status(400).json({ message: `No shape with id ${id} found in DB` });
    const shape = await Shape.findById(id).exec();
    if (!shape) return res.status(400).json({ message: `No shape with id ${id} found in DB` });

    // update the shape
    shape.name = name;
    shape.description = description;
    shape.img_path = img_path;

    // send the updated shape to the DB
    const updatedShape = await shape.save();

    // log response and send it to the client
    if (updatedShape) res.status(200).json({ message: `Shape ${name} updated successfully` });
    else res.status(500).json({ message: `Error: Shape ${name} could not be updated` });
});


// @desc    Delete a shape
// @route   DELETE /shapes
// @access  Private/Admin
const deleteShape = asyncHandler(async (req, res) => {
    const { id } = req.body; // destructure the request body

    // check if data was sent
    if (!id) return res.status(400).json({ message: 'Please fill in all fields' });

    // check if shape id is valid
    if (!isValidObjectId(id)) return res.status(400).json({ message: `No shape with id ${id} found in DB` });
    const shape = await Shape.findById(id).exec();
    if (!shape) return res.status(400).json({ message: `No shape with id ${id} found in DB` });

    // delete the shape
    const deletedShape = await shape.deleteOne();

    // log response and send it to the client
    if (deletedShape) res.status(200).json({ message: `Shape ${shape.name} deleted successfully` });
    else res.status(500).json({ message: `Error: Shape ${shape.name} could not be deleted` });
});


module.exports = {
    getAllShapes,
    getShapeById,
    createShape,
    updateShape,
    deleteShape
};