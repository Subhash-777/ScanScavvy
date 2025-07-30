const productModel = require('../models/productModel');

const productController = {
  // Scan barcode and get product information
  scanBarcode: async (req, res) => {
    try {
      console.log('scanBarcode called with:', req.body);
      
      const { barcode } = req.body;
      
      if (!barcode) {
        console.log('No barcode provided in request body');
        return res.status(400).json({
          success: false,
          message: 'Barcode is required',
          received: req.body
        });
      }

      console.log('Searching for barcode:', barcode);
      const product = await productModel.getProductByBarcode(barcode);
      
      if (!product) {
        console.log('Product not found for barcode:', barcode);
        return res.status(404).json({
          success: false,
          message: 'Product not found',
          barcode: barcode
        });
      }

      console.log('Product found:', product);

      // Check if product is expired
      const currentDate = new Date();
      const expDate = new Date(product.exp_date);
      const isExpired = expDate < currentDate;

      // Parse alternates from JSON
      let alternates = [];
      if (product.json_alternates) {
        try {
          const parsedAlternates = JSON.parse(product.json_alternates);
          alternates = parsedAlternates.alternates || [];
        } catch (error) {
          console.error('Error parsing alternates JSON:', error);
        }
      }

      const response = {
        success: true,
        data: {
          ...product,
          alternates,
          isExpired,
          daysToExpiry: Math.ceil((expDate - currentDate) / (1000 * 60 * 60 * 24))
        }
      };

      console.log('Sending response:', response);
      res.json(response);
    } catch (error) {
      console.error('Error scanning barcode:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  getProductByBarcode: async (req, res) => {
    try {
      console.log('getProductByBarcode called with params:', req.params);

      const { barcode } = req.params;
      const product = await productModel.getProductByBarcode(barcode);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Error getting product:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get alternates for a product
  getAlternates: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await productModel.getProductById(id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      let alternates = [];
      if (product.json_alternates) {
        try {
          const parsedAlternates = JSON.parse(product.json_alternates);
          alternates = parsedAlternates.alternates || [];
        } catch (error) {
          console.error('Error parsing alternates JSON:', error);
        }
      }

      res.json({
        success: true,
        data: alternates
      });
    } catch (error) {
      console.error('Error getting alternates:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get all products (for admin)
  getAllProducts: async (req, res) => {
    try {
      console.log('getAllProducts called');
      const products = await productModel.getAllProducts();
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      console.error('Error getting all products:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Add new product (for admin)
  addProduct: async (req, res) => {
    try {
      console.log('addProduct called with:', req.body);
      
      const { barcode, name, brand, mfg_date, exp_date, alternates } = req.body;
      
      if (!barcode || !name || !brand) {
        return res.status(400).json({
          success: false,
          message: 'Barcode, name, and brand are required',
          received: req.body
        });
      }

      const json_alternates = alternates ? JSON.stringify({ alternates }) : null;
      
      const productId = await productModel.addProduct({
        barcode,
        name,
        brand,
        mfg_date,
        exp_date,
        json_alternates
      });

      res.status(201).json({
        success: true,
        data: { id: productId },
        message: 'Product added successfully'
      });
    } catch (error) {
      console.error('Error adding product:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Product with this barcode already exists'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Update product (for admin)
  updateProduct: async (req, res) => {
    try {
      console.log('updateProduct called with:', req.params, req.body);
      
      const { id } = req.params;
      const { name, brand, mfg_date, exp_date, alternates } = req.body;
      
      const json_alternates = alternates ? JSON.stringify({ alternates }) : null;
      
      const updated = await productModel.updateProduct(id, {
        name,
        brand,
        mfg_date,
        exp_date,
        json_alternates
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        message: 'Product updated successfully'
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Delete product (for admin)
  deleteProduct: async (req, res) => {
    try {
      console.log('deleteProduct called with:', req.params);
      
      const { id } = req.params;
      const deleted = await productModel.deleteProduct(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get all brands
  getAllBrands: async (req, res) => {
    try {
      console.log('getAllBrands called');
      const brands = await productModel.getAllBrands();
      res.json({
        success: true,
        data: brands
      });
    } catch (error) {
      console.error('Error getting brands:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Add new brand
  addBrand: async (req, res) => {
    try {
      console.log('addBrand called with:', req.body);
      
      const { name, category } = req.body;
      
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Brand name is required',
          received: req.body
        });
      }

      const brandId = await productModel.addBrand({ name, category });
      
      res.status(201).json({
        success: true,
        data: { id: brandId },
        message: 'Brand added successfully'
      });
    } catch (error) {
      console.error('Error adding brand:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'Brand already exists'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },
  getExpiredProducts: async (req, res) => {
    try {
      console.log('getExpiredProducts called');
      const expiredProducts = await productModel.getExpiredProducts();
      
      // Add additional information for each expired product
      const enrichedProducts = expiredProducts.map(product => {
        const currentDate = new Date();
        const expDate = new Date(product.exp_date);
        const daysExpired = Math.ceil((currentDate - expDate) / (1000 * 60 * 60 * 24));
        
        // Parse alternates from JSON
        let alternates = [];
        if (product.json_alternates) {
          try {
            const parsedAlternates = JSON.parse(product.json_alternates);
            alternates = parsedAlternates.alternates || [];
          } catch (error) {
            console.error('Error parsing alternates JSON:', error);
          }
        }
        
        return {
          ...product,
          alternates,
          isExpired: true,
          daysExpired: daysExpired
        };
      });

      res.json({
        success: true,
        data: enrichedProducts,
        count: enrichedProducts.length
      });
    } catch (error) {
      console.error('Error getting expired products:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },

  // Get products expiring soon
  getProductsExpiringSoon: async (req, res) => {
    try {
      console.log('getProductsExpiringSoon called');
      const { days = 7 } = req.query; // Default to 7 days if not specified
      
      const expiringProducts = await productModel.getProductsExpiringSoon(parseInt(days));
      
      // Add additional information for each expiring product
      const enrichedProducts = expiringProducts.map(product => {
        const currentDate = new Date();
        const expDate = new Date(product.exp_date);
        const daysToExpiry = Math.ceil((expDate - currentDate) / (1000 * 60 * 60 * 24));
        
        // Parse alternates from JSON
        let alternates = [];
        if (product.json_alternates) {
          try {
            const parsedAlternates = JSON.parse(product.json_alternates);
            alternates = parsedAlternates.alternates || [];
          } catch (error) {
            console.error('Error parsing alternates JSON:', error);
          }
        }
        
        return {
          ...product,
          alternates,
          isExpired: false,
          daysToExpiry: daysToExpiry
        };
      });

      res.json({
        success: true,
        data: enrichedProducts,
        count: enrichedProducts.length,
        daysRange: parseInt(days)
      });
    } catch (error) {
      console.error('Error getting products expiring soon:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },
    // Search products
  searchProducts: async (req, res) => {
    try {
      console.log('searchProducts called with query:', req.query);
      
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const products = await productModel.searchProducts(q);
      
      res.json({
        success: true,
        data: products,
        count: products.length,
        searchTerm: q
      });
    } catch (error) {
      console.error('Error searching products:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  },
  // Get products by brand
  getProductsByBrand: async (req, res) => {
    try {
      console.log('getProductsByBrand called with:', req.params);
      
      const { brand } = req.params;
      const products = await productModel.getProductsByBrand(brand);
      
      res.json({
        success: true,
        data: products,
        count: products.length,
        brand: brand
      });
    } catch (error) {
      console.error('Error getting products by brand:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

module.exports = productController;