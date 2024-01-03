const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.route('/')
    .get(orderController.getAllOrders)
    .post(orderController.createOrder)
    .patch(orderController.updateOrder)
    .delete(orderController.deleteOrder);

router.route('/:id')
    .get(orderController.getOrderById);

module.exports = router;