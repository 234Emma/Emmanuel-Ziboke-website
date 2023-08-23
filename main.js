const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Emmanuelz1@',
    database: 'product_db'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to database');
    }
});


app.post('/createCategories', (req, res) => {
    const { id, name } = req.body;
    if (!name) {
        res.status(400).json({ error: 'Category name is required' });
        return;
    }

    connection.query('INSERT INTO categories (id, name) VALUES (?, ?)', [id, name], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id, name });
        }
    });
});


app.put('/updateCategories/:id', (req, res) => {
    const categoryId = req.params.id;
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: 'Category name is required' });
      return;
    }
  
    db.query('UPDATE categories SET name = ? WHERE id = ?', [name, categoryId], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ message: 'Category updated successfully' });
      }
    });
  });


  app.delete('/deletecategories/:id', (req, res) => {
    const categoryId = req.params.id;
  
    connection.query('DELETE FROM categories WHERE id = ?', [categoryId], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json({ message: 'Category deleted successfully' });
      }
    });
});
  


app.post('/addProducts', (req, res) => {
    const { name, price, image_url, category_id } = req.body;
  
    if (!name || !price || !image_url || !category_id) {
      res.status(400).json({ error: 'Product name, price, image URL, and category ID are required' });
      return;
    }
  
    db.query(
      'INSERT INTO products (name, price, image_url, category_id) VALUES (?, ?, ?, ?)',
      [name, price, image_url, category_id],
      (err, result) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(201).json({
            productId: result.insertId,
            productName: name,
            productPrice: price,
            productImage: image_url
          });
        }
      }
    );
  });
  
  

  app.put('/updateProducts/:id', (req, res) => {
    const productId = req.params.id;
    const { name, price, image_url, category_id } = req.body;
  
    if (!name || !price || !image_url || !category_id) {
      res.status(400).json({ error: 'Product name, price, image URL, and category ID are required' });
      return;
    }
  
    connection.query(
      'UPDATE products SET name = ?, price = ?, image_url = ?, category_id = ? WHERE id = ?',
      [name, price, image_url, category_id, productId],
      (err) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(200).json({ message: 'Product updated successfully' });
        }
      }
    );
});



app.delete('/deleteProducts/:id', (req, res) => {
  const productId = req.params.id;

  connection.query('DELETE FROM products WHERE id = ?', [productId], (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Product deleted successfully' });
    }
  });
});

  
connection.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to database');
  }
});




app.use(express.json());
app.post('/register', (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Insert user data into the database
  connection.query(
    'INSERT INTO registration (firstName, lastName, email, password) VALUES (?, ?, ?, ?)',
    [firstName, lastName, email, password],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ message: 'User registered successfully' });
      }
    }
  );
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


      