// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes

const postRoutes = require('./routes/post');
app.use('/api/posts', postRoutes);

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);





app.get('/', (req, res) => {
  res.send('API is running...');
});

// Add this after app.use(cors()) and app.use(express.json())




// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
