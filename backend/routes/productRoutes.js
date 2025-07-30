const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
// Base URL: localhost:3000/api
// POST /api/scan - Scan barcode and get product info
router.post('/scan', productController.scanBarcode);

// GET /api/products - Get all products (for admin) - MOVED UP
router.get('/products', productController.getAllProducts);

// POST /api/products - Add new product (for admin)
router.post('/products', productController.addProduct);

// Route to get all expired products
router.get('/products/expired', productController.getExpiredProducts);

// Route to get products expiring soon (accepts ?days=7 by default)
router.get('/products/expiring-soon', productController.getProductsExpiringSoon);

// Route to search products by query (?q=searchTerm)
router.get('/products/search', productController.searchProducts);

// Route to get products by brand
router.get('/products/brand/:brand', productController.getProductsByBrand);

// GET /api/products/:id/alternates - Get alternate products
router.get('/products/:id/alternates', productController.getAlternates);

// GET /api/products/:barcode - Get product by barcode - MOVED DOWN
router.get('/products/:barcode', productController.getProductByBarcode);

// PUT /api/products/:id - Update product (for admin)
router.put('/products/:id', productController.updateProduct);

// DELETE /api/products/:id - Delete product (for admin)
router.delete('/products/:id', productController.deleteProduct);

// GET /api/brands - Get all brands
router.get('/brands', productController.getAllBrands);

// POST /api/brands - Add new brand
router.post('/brands', productController.addBrand);

module.exports = router;