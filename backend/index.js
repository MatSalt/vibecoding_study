
const express = require('express');
const { Sequelize } = require('sequelize');

// --- Database Connection ---
// Using SQLite, which will create a 'database.sqlite' file in the backend directory.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const app = express();
const port = 3001; // Using 3001 to avoid potential conflict with frontend dev server

app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

// --- Start Server and Test DB Connection ---
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    app.listen(port, () => {
      console.log(`Backend server listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

startServer();
