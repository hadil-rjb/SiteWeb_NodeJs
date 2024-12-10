const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const router = express.Router();
// Register
router.post('/register', async (req, res) => {
 try {
 const { username, password, role } = req.body;
 const user = new User({ username, password, role });
 await user.save();
 res.status(201).json({ message: 'User created' });
 } catch (err) {
 res.status(400).json({ message: 'Error creating user', error: err.message });
 }
});
// Login
router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Ajoute le rôle dans la réponse
      res.json({ token, role: user.role });
    } catch (err) {
      res.status(400).json({ message: 'Error logging in', error: err.message });
    }
  });
  
module.exports = router;