const express = require('express');
const router = express.Router();
const shapesController = require('../controllers/shapesController');

router.route('/')
    .get(shapesController.getAllShapes)
    .post(shapesController.createShape)
    .patch(shapesController.updateShape)
    .delete(shapesController.deleteShape);

router.route('/:id')
    .get(shapesController.getShapeById);

module.exports = router;