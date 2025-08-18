
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./models');

const app = express();

app.use(express.json());
const port = 3001; // Using 3001 to avoid potential conflict with frontend dev server

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, 'supersecretkey', { expiresIn: '1h' });
};

// User Registration
app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password } = req.body.user;

    if (!username || !email || !password) {
      return res.status(422).json({ errors: { body: ['username, email, and password are required'] } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.User.create({
      username,
      email,
      password_hash: hashedPassword,
    });

    const token = generateToken(user);

    res.status(201).json({
      user: {
        email: user.email,
        token,
        username: user.username,
        bio: user.bio,
        image: user.image_url,
      },
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(422).json({ errors: { email: ['has already been taken'] } });
    }
    console.error(error);
    res.status(500).json({ errors: { body: ['Something went wrong'] } });
  }
});

// User Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body.user;

    if (!email || !password) {
      return res.status(422).json({ errors: { body: ['email and password are required'] } });
    }

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(403).json({ errors: { email: ['is invalid'] } });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(403).json({ errors: { password: ['is invalid'] } });
    }

    const token = generateToken(user);

    res.status(200).json({
      user: {
        email: user.email,
        token,
        username: user.username,
        bio: user.bio,
        image: user.image_url,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: { body: ['Something went wrong'] } });
  }
});

// --- Start Server and Test DB Connection ---
async function startServer() {
  try {
    await db.sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    app.listen(port, () => {
      console.log(`Backend server listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
