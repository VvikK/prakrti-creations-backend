const express = require('express');
const router = express.Router();
const beadController = require('../controllers/beadsController');

router.route('/')
    .get(beadController.getAllBeads)
    .post(beadController.createBead)
    .patch(beadController.updateBead)
    .delete(beadController.deleteBead);

router.route('/:id')
    .get(beadController.getBeadById);

module.exports = router;