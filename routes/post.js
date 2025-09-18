const express = require('express');
const Post = require('../models/Post');
const axios = require('axios');

const router = express.Router();

// Replace with real JWT middleware if needed
const dummyUserId = '650000000000000000000001'; // Replace with actual user ID from your database

// Reverse geocode (coordinates → address)
const reverseGeocode = async (lat, lon) => {
  try {
    const res = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        format: 'json',
        lat,
        lon
      }
    });
    return res.data.display_name || 'Unknown location';
  } catch (err) {
    console.error('Geocode error:', err.message);
    return 'Unknown location';
  }
};

// @route   POST /api/posts
router.post('/', async (req, res) => {
  const { text, location } = req.body;
  const { coordinates } = location;
  const [lon, lat] = coordinates;

  try {
    const address = await reverseGeocode(lat, lon);

    const newPost = new Post({
      userId: dummyUserId,
      text,
      location: {
        coordinates,
        address
      }
    });

    await newPost.save();
    res.status(201).json({ msg: 'Post created', post: newPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
