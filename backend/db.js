const mysql = require('mysql2');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Subhash@7432',
  database: process.env.DB_NAME || 'barcode_scanner',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Database connected successfully');
  connection.release();
});

// Initialize database tables
const initializeDB = () => {
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      barcode VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      brand VARCHAR(255) NOT NULL,
      description TEXT,
      mfg_date DATE,
      exp_date DATE,
      mrp DECIMAL(10,2),
      brand_rating DECIMAL(3,2),
      brand_review TEXT,
      
      -- Nutritional Information
      calories INT,
      carbohydrates DECIMAL(5,2),
      protein DECIMAL(5,2),
      fat DECIMAL(5,2),
      sugar DECIMAL(5,2),
      fiber DECIMAL(5,2),
      sodium DECIMAL(8,2),
      vitamins TEXT,
      minerals TEXT,
      
      -- Additional fields
      category VARCHAR(100),
      subcategory VARCHAR(100),
      weight VARCHAR(50),
      volume VARCHAR(50),
      ingredients TEXT,
      allergens TEXT,
      
      json_alternates TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      
      -- Indexes for better performance
      INDEX idx_brand (brand),
      INDEX idx_category (category),
      INDEX idx_exp_date (exp_date),
      INDEX idx_name (name)
    )
  `;

  const createBrandsTable = `
    CREATE TABLE IF NOT EXISTS brands (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      category VARCHAR(255),
      rating DECIMAL(3,2),
      review_count INT DEFAULT 0,
      website VARCHAR(255),
      country VARCHAR(100),
      established_year INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      INDEX idx_rating (rating),
      INDEX idx_category (category)
    )
  `;

  const createNutritionTable = `
    CREATE TABLE IF NOT EXISTS nutrition_facts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT,
      serving_size VARCHAR(50),
      servings_per_container INT,
      calories_per_serving INT,
      total_fat DECIMAL(5,2),
      saturated_fat DECIMAL(5,2),
      trans_fat DECIMAL(5,2),
      cholesterol DECIMAL(5,2),
      sodium DECIMAL(8,2),
      total_carbohydrates DECIMAL(5,2),
      dietary_fiber DECIMAL(5,2),
      total_sugar DECIMAL(5,2),
      added_sugar DECIMAL(5,2),
      protein DECIMAL(5,2),
      vitamin_a DECIMAL(5,2),
      vitamin_c DECIMAL(5,2),
      vitamin_d DECIMAL(5,2),
      calcium DECIMAL(5,2),
      iron DECIMAL(5,2),
      potassium DECIMAL(5,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      INDEX idx_product_id (product_id)
    )
  `;

  const createReviewsTable = `
    CREATE TABLE IF NOT EXISTS product_reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT,
      brand_id INT,
      rating DECIMAL(3,2),
      review_text TEXT,
      reviewer_name VARCHAR(100),
      review_date DATE,
      verified_purchase BOOLEAN DEFAULT FALSE,
      helpful_count INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
      INDEX idx_product_rating (product_id, rating),
      INDEX idx_brand_rating (brand_id, rating)
    )
  `;

  // Create tables
  pool.query(createProductsTable, (err) => {
    if (err) {
      console.error('Error creating products table:', err);
    } else {
      console.log('Products table created/verified');
    }
  });

  pool.query(createBrandsTable, (err) => {
    if (err) {
      console.error('Error creating brands table:', err);
    } else {
      console.log('Brands table created/verified');
    }
  });

  pool.query(createNutritionTable, (err) => {
    if (err) {
      console.error('Error creating nutrition_facts table:', err);
    } else {
      console.log('Nutrition facts table created/verified');
    }
  });

  pool.query(createReviewsTable, (err) => {
    if (err) {
      console.error('Error creating product_reviews table:', err);
    } else {
      console.log('Product reviews table created/verified');
    }
  });

  // Insert sample data
  insertSampleData();
};

// Insert comprehensive sample data
const insertSampleData = () => {
  const sampleProducts = [
    {
      barcode: '8901030745649',
      name: 'Amul Butter 500g',
      brand: 'Amul',
      description: 'Fresh and creamy butter made from pure milk',
      mfg_date: '2024-01-15',
      exp_date: '2024-07-15',
      mrp: 250.00,
      brand_rating: 4.5,
      brand_review: 'Trusted dairy brand with excellent quality products',
      calories: 717,
      carbohydrates: 0.1,
      protein: 0.85,
      fat: 81.0,
      sugar: 0,
      fiber: 0,
      sodium: 714,
      vitamins: 'A, D',
      minerals: 'Calcium',
      category: 'Dairy',
      subcategory: 'Butter',
      weight: '500g',
      volume: null,
      ingredients: 'Milk fat',
      allergens: 'Milk',
      json_alternates: JSON.stringify({ alternates: ['8901030745650', '8901030745651'] })
    }
  ];

  const insertProductQuery = `
    INSERT INTO products (
      barcode, name, brand, description, mfg_date, exp_date, mrp, brand_rating, brand_review,
      calories, carbohydrates, protein, fat, sugar, fiber, sodium, vitamins, minerals,
      category, subcategory, weight, volume, ingredients, allergens,
      json_alternates
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE name=VALUES(name)
  `;

  sampleProducts.forEach(product => {
    const values = [
      product.barcode,
      product.name,
      product.brand,
      product.description,
      product.mfg_date,
      product.exp_date,
      product.mrp,
      product.brand_rating,
      product.brand_review,
      product.calories,
      product.carbohydrates,
      product.protein,
      product.fat,
      product.sugar,
      product.fiber,
      product.sodium,
      product.vitamins,
      product.minerals,
      product.category,
      product.subcategory,
      product.weight,
      product.volume,
      product.ingredients,
      product.allergens,
      product.json_alternates
    ];

    pool.query(insertProductQuery, values, (err, result) => {
      if (err) {
        console.error('Error inserting sample product:', err);
      } else {
        console.log(`Sample product inserted or updated: ${product.name}`);
      }
    });
  });
};

// Initialize DB and export pool
initializeDB();

module.exports = pool;
