const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const db = require('./db');

app.use(cors());
app.use(express.json());

// Example route
app.get('/', (req, res) => {
  res.send('School Website Backend is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
