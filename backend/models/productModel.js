const db = require('../db');

const productModel = {
  // Get product by barcode - Enhanced with better error handling
  getProductByBarcode: (barcode) => {
    return new Promise((resolve, reject) => {
      console.log('productModel.getProductByBarcode called with:', barcode);
      
      if (!barcode) {
        const error = new Error('Barcode parameter is required');
        console.error('productModel error:', error.message);
        reject(error);
        return;
      }

      const query = 'SELECT * FROM products WHERE barcode = ?';
      console.log('Executing query:', query, 'with params:', [barcode]);
      
      db.query(query, [barcode], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          console.error('Error details:', {
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState,
            sqlMessage: err.sqlMessage
          });
          reject(err);
        } else {
          console.log('Query results:', results);
          console.log('Returning:', results[0] || null);
          resolve(results[0] || null);
        }
      });
    });
  },

  // Get product by ID
  getProductById: (id) => {
    return new Promise((resolve, reject) => {
      console.log('productModel.getProductById called with:', id);
      
      if (!id) {
        const error = new Error('ID parameter is required');
        console.error('productModel error:', error.message);
        reject(error);
        return;
      }

      const query = 'SELECT * FROM products WHERE id = ?';
      console.log('Executing query:', query, 'with params:', [id]);
      
      db.query(query, [id], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          reject(err);
        } else {
          console.log('Query results:', results);
          resolve(results[0] || null);
        }
      });
    });
  },

  // Get all products
  getAllProducts: () => {
    return new Promise((resolve, reject) => {
      console.log('productModel.getAllProducts called');
      
      const query = 'SELECT * FROM products ORDER BY created_at DESC';
      console.log('Executing query:', query);
      
      db.query(query, (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          reject(err);
        } else {
          console.log('Query results count:', results.length);
          resolve(results);
        }
      });
    });
  },

  // Add new product
  addProduct: (productData) => {
  return new Promise((resolve, reject) => {
    console.log('productModel.addProduct called with:', productData);

    const requiredFields = ['barcode', 'name', 'brand'];
    for (const field of requiredFields) {
      if (!productData[field]) {
        const error = new Error(`${field} is required`);
        console.error('productModel error:', error.message);
        reject(error);
        return;
      }
    }

    const query = `
      INSERT INTO products (
        barcode, name, brand, description, mfg_date, exp_date, mrp, brand_rating, brand_review,
        calories, carbohydrates, protein, fat, sugar, fiber, sodium, vitamins, minerals,
        category, subcategory, weight, volume, ingredients, allergens, json_alternates
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      productData.barcode,
      productData.name,
      productData.brand,
      productData.description || null,
      productData.mfg_date || null,
      productData.exp_date || null,
      productData.mrp || null,
      productData.brand_rating || null,
      productData.brand_review || null,
      productData.calories || null,
      productData.carbohydrates || null,
      productData.protein || null,
      productData.fat || null,
      productData.sugar || null,
      productData.fiber || null,
      productData.sodium || null,
      productData.vitamins || null,
      productData.minerals || null,
      productData.category || null,
      productData.subcategory || null,
      productData.weight || null,
      productData.volume || null,
      productData.ingredients || null,
      productData.allergens || null,
      productData.json_alternates || null,
    ];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        reject(err);
      } else {
        console.log('Insert results:', results);
        resolve(results.insertId);
      }
    });
  }); 
},

  // Update product
  updateProduct: (id, productData) => {
  return new Promise((resolve, reject) => {
    console.log('productModel.updateProduct called with:', id, productData);

    if (!id) {
      const error = new Error('ID parameter is required');
      console.error('productModel error:', error.message);
      reject(error);
      return;
    }

    const query = `
      UPDATE products SET 
        name = ?, brand = ?, description = ?, mfg_date = ?, exp_date = ?, mrp = ?, 
        brand_rating = ?, brand_review = ?, calories = ?, carbohydrates = ?, protein = ?, fat = ?, 
        sugar = ?, fiber = ?, sodium = ?, vitamins = ?, minerals = ?, category = ?, subcategory = ?, 
        weight = ?, volume = ?, ingredients = ?, allergens = ?, json_alternates = ?
      WHERE id = ?
    `;

    const values = [
      productData.name || null,
      productData.brand || null,
      productData.description || null,
      productData.mfg_date || null,
      productData.exp_date || null,
      productData.mrp || null,
      productData.brand_rating || null,
      productData.brand_review || null,
      productData.calories || null,
      productData.carbohydrates || null,
      productData.protein || null,
      productData.fat || null,
      productData.sugar || null,
      productData.fiber || null,
      productData.sodium || null,
      productData.vitamins || null,
      productData.minerals || null,
      productData.category || null,
      productData.subcategory || null,
      productData.weight || null,
      productData.volume || null,
      productData.ingredients || null,
      productData.allergens || null,
      productData.json_alternates || null,
      id,
    ];

    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        reject(err);
      } else {
        console.log('Update results:', results);
        resolve(results.affectedRows > 0);
      }
    });
  });
},


  // Delete product
  deleteProduct: (id) => {
    return new Promise((resolve, reject) => {
      console.log('productModel.deleteProduct called with:', id);
      
      if (!id) {
        const error = new Error('ID parameter is required');
        console.error('productModel error:', error.message);
        reject(error);
        return;
      }

      const query = 'DELETE FROM products WHERE id = ?';
      console.log('Executing query:', query, 'with params:', [id]);
      
      db.query(query, [id], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          reject(err);
        } else {
          console.log('Delete results:', results);
          resolve(results.affectedRows > 0);
        }
      });
    });
  },

  // Get all brands
  getAllBrands: () => {
    return new Promise((resolve, reject) => {
      console.log('productModel.getAllBrands called');
      
      const query = 'SELECT * FROM brands ORDER BY name';
      console.log('Executing query:', query);
      
      db.query(query, (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          reject(err);
        } else {
          console.log('Query results count:', results.length);
          resolve(results);
        }
      });
    });
  },

  // Add new brand
  addBrand: (brandData) => {
    return new Promise((resolve, reject) => {
      console.log('productModel.addBrand called with:', brandData);
      
      if (!brandData.name) {
        const error = new Error('Brand name is required');
        console.error('productModel error:', error.message);
        reject(error);
        return;
      }

      const query = 'INSERT INTO brands (name, category) VALUES (?, ?)';
      const values = [brandData.name, brandData.category || null];

      console.log('Executing query:', query, 'with values:', values);

      db.query(query, values, (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          reject(err);
        } else {
          console.log('Insert results:', results);
          resolve(results.insertId);
        }
      });
    });
  },

  // Search products by name or brand
  searchProducts: (searchTerm) => {
    return new Promise((resolve, reject) => {
      console.log('productModel.searchProducts called with:', searchTerm);
      
      if (!searchTerm) {
        const error = new Error('Search term is required');
        console.error('productModel error:', error.message);
        reject(error);
        return;
      }

      const query = `
        SELECT * FROM products 
        WHERE name LIKE ? OR brand LIKE ? 
        ORDER BY name
      `;
      const searchPattern = `%${searchTerm}%`;
      
      console.log('Executing query:', query, 'with params:', [searchPattern, searchPattern]);
      
      db.query(query, [searchPattern, searchPattern], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          reject(err);
        } else {
          console.log('Search results count:', results.length);
          resolve(results);
        }
      });
    });
  },

  // Get products by brand
  getProductsByBrand: (brand) => {
    return new Promise((resolve, reject) => {
      console.log('productModel.getProductsByBrand called with:', brand);
      
      if (!brand) {
        const error = new Error('Brand parameter is required');
        console.error('productModel error:', error.message);
        reject(error);
        return;
      }

      const query = 'SELECT * FROM products WHERE brand = ? ORDER BY name';
      console.log('Executing query:', query, 'with params:', [brand]);
      
      db.query(query, [brand], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          reject(err);
        } else {
          console.log('Query results count:', results.length);
          resolve(results);
        }
      });
    });
  },

  // Get expired products
  getExpiredProducts: () => {
    return new Promise((resolve, reject) => {
      console.log('productModel.getExpiredProducts called');
      
      const query = 'SELECT * FROM products WHERE exp_date < CURDATE() ORDER BY exp_date';
      console.log('Executing query:', query);
      
      db.query(query, (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          reject(err);
        } else {
          console.log('Expired products count:', results.length);
          resolve(results);
        }
      });
    });
  },

  // Get products expiring soon (within specified days)
  getProductsExpiringSoon: (days = 7) => {
    return new Promise((resolve, reject) => {
      console.log('productModel.getProductsExpiringSoon called with days:', days);
      
      const query = `
        SELECT * FROM products 
        WHERE exp_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
        ORDER BY exp_date
      `;
      
      console.log('Executing query:', query, 'with params:', [days]);
      
      db.query(query, [days], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          reject(err);
        } else {
          console.log('Products expiring soon count:', results.length);
          resolve(results);
        }
      });
    });
  },

  // Test database connection
  testConnection: () => {
    return new Promise((resolve, reject) => {
      console.log('Testing database connection...');
      
      const query = 'SELECT 1 as test';
      
      db.query(query, (err, results) => {
        if (err) {
          console.error('Database connection test failed:', err);
          reject(err);
        } else {
          console.log('Database connection test successful:', results);
          resolve(true);
        }
      });
    });
  }
};

module.exports = productModel;