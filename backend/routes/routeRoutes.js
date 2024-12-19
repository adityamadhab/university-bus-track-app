const express = require('express');
const router = express.Router();
const Route = require('../models/Route');

// Get all routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find().populate('activeDrivers');
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific route details
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id).populate('activeDrivers');
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new route
router.post('/', async (req, res) => {
  try {
    const newRoute = new Route(req.body);
    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 