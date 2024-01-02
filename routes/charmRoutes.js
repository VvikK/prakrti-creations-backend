const express = require('express');
const router = express.Router();
const charmController = require('../controllers/charmsController');

router.route('/')
    .get(charmController.getAllCharms)
    .post(charmController.createCharm)
    .patch(charmController.updateCharm)
    .delete(charmController.deleteCharm);

router.route('/:id')
    .get(charmController.getCharmById);

module.exports = router;