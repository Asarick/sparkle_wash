// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/sparklewash', { useNewUrlParser: true, useUnifiedTopology: true });

// Define models
const Appointment = mongoose.model('Appointment', {
  customer: String,
  service: String,
  date: Date,
  status: String
});

const Service = mongoose.model('Service', {
  name: String,
  price: Number
});

const Employee = mongoose.model('Employee', {
  name: String,
  position: String
});

const Feedback = mongoose.model('Feedback', {
  customer: String,
  message: String,
  date: Date,
  status: String
});

const User = mongoose.model('User', {
  name: String,
  email: String,
  password: String,
  lastLogin: Date
});

// Routes
app.post('/api/book', async (req, res) => {
  const appointment = new Appointment(req.body);
  await appointment.save();
  res.json({ success: true, appointment });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    user.lastLogin = new Date();
    await user.save();
    res.json({ success: true, user });
  } else {
    res.json({ success: false });
  }
});

app.post('/api/contact', async (req, res) => {
  const feedback = new Feedback(req.body);
  await feedback.save();
  res.json({ success: true, feedback });
});

// ... add more routes for CRUD operations on other models

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));