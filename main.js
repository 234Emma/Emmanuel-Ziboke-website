const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
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




app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and Password required' });
  }

  const query = "SELECT * FROM registration WHERE email = ? AND password = ?";
  const values = [email, password]; // Define values here

  connection.query(query, values, (err, results) => {
    if (err) {
      console.error('Error: ' + err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }
    const user = results[0];
    const { password, ...userNoPwd } = user;
    if (user.password === password) {
      const token = jwt.sign(userNoPwd, secretKey, { expiresIn: '1h' });

      // Define the 'Id' and 'tokens' values here
      // const Id = 3; // Replace with your actual Id value
      // const tokens = '...'; // Replace '...' with the actual JWT token value



      const insertQuery = "INSERT INTO user_tokens (tokens, user_id) VALUES (?, ?)";
      const insertValues = [token, user.id];

      connection.query(insertQuery, insertValues, (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Error: ' + insertErr);
          return res.status(500).json({ message: 'Server error' });
        }

        return res.status(200).json({
          message: 'success',
          token
        });
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});







const secretKey = 'Iamasecretnobodyshouldseeme'


function checkAuthorization(req, res, next) {
  // Get the Authorization header from the request
  const authHeader = req.headers['authorization'];

  // Check if the Authorization header exists and starts with "Bearer "
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extract the token without "Bearer "
    const token = authHeader.slice(7);
    // Check if the token matches the secret token
    var decoded = jwt.verify(token, secretKey);
    console.log(decoded) // bar
    
  }
  // If the token is not valid or missing, send a 401 Unauthorized response
  return res.status(401).json({ message: 'Unauthorized baga' });
}
// Use the middleware for specific routes
app.get('/protected', checkAuthorization, (req, res) => {
  res.send('Protected Route');
});


// try {
//   const decoded = jwt.verify(presentedToken, secretKey);
//   // The token is valid
//   console.log(decoded);
// } catch (error) {
//   // The token is invalid or expired
//   console.error(error);
// }




// create the connection to database
const connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to database');
  }
});

app.use(checkAuthorization);

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





// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


