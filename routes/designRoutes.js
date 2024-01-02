const express = require('express');
const router = express.Router();
const designController = require('../controllers/designsController');

router.route('/')
    .get(designController.getAllDesigns)
    .post(designController.createDesign)
    .patch(designController.updateDesign)
    .delete(designController.deleteDesign);

router.route('/:id');

module.exports = router;