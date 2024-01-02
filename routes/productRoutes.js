const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.route('/')
    .get(productController.getAllProducts)
    .post(productController.createProduct)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct);

router.route('/:id')
    .get(productController.getProductById);

module.exports = router;