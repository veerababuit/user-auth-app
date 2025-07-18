const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { name, mobile, email, password } = req.body;
  if (!name || !mobile || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: 'Email already in use' });
  const user = new User({ name, mobile, email, password });
  await user.save();
  res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, 'secretkey');
  res.json({ token });
});

router.get('/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secretkey');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ name: user.name, mobile: user.mobile, email: user.email });
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.put('/user', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, 'secretkey');
    const { name, mobile, email } = req.body;
    if (!name && !mobile && !email) {
      return res.status(400).json({ message: 'At least one field (name, mobile, or email) is required' });
    }
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if email is being updated and if it already exists for another user
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailExists) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const updateFields = {};
    if (name) updateFields.name = name;
    if (mobile) updateFields.mobile = mobile;
    if (email) updateFields.email = email;

    const updatedUser = await User.findByIdAndUpdate(decoded.id, updateFields, { new: true, runValidators: true });
    res.json({ message: 'User updated successfully', name: updatedUser.name, mobile: updatedUser.mobile, email: updatedUser.email });
  } catch (error) {
    console.error('Update error:', error.message);
    res.status(401).json({ message: 'Invalid token or update failed' });
  }
});

module.exports = router;