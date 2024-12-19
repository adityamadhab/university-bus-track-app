const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const { validateBusUpdate } = require('../middleware/validation');
const { catchAsync } = require('../utils/errorHandlers');

// Get all buses with filtering and pagination
router.get('/', catchAsync(async (req, res) => {
  const { 
    status, 
    routeName, 
    isActive,
    page = 1,
    limit = 10
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (routeName) filter.routeName = { $regex: routeName, $options: 'i' };
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const buses = await Bus.find(filter)
    .sort({ busNumber: 1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .lean();

  const total = await Bus.countDocuments(filter);

  res.json({
    buses,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      perPage: parseInt(limit)
    }
  });
}));

// Get specific bus with full details
router.get('/:id', catchAsync(async (req, res) => {
  const bus = await Bus.findById(req.params.id).lean();
  if (!bus) {
    return res.status(404).json({ message: 'Bus not found' });
  }
  res.json(bus);
}));

// Update bus location and status
router.put('/:id/location', validateBusUpdate, catchAsync(async (req, res) => {
  const { location, status, capacity } = req.body;
  const bus = await Bus.findByIdAndUpdate(
    req.params.id,
    {
      currentLocation: location,
      status,
      'capacity.current': capacity,
      lastUpdated: new Date()
    },
    { new: true, runValidators: true }
  ).lean();

  if (!bus) {
    return res.status(404).json({ message: 'Bus not found' });
  }

  res.json(bus);
}));

// Add new alert to bus
router.post('/:id/alerts', catchAsync(async (req, res) => {
  const { type, message, severity } = req.body;
  const bus = await Bus.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        alerts: {
          type,
          message,
          severity,
          timestamp: new Date()
        }
      }
    },
    { new: true }
  ).lean();

  if (!bus) {
    return res.status(404).json({ message: 'Bus not found' });
  }

  res.status(201).json(bus);
}));

// Update bus statistics
router.put('/:id/statistics', catchAsync(async (req, res) => {
  const { totalTrips, totalPassengers, averageRating, onTimePerformance } = req.body;
  const bus = await Bus.findByIdAndUpdate(
    req.params.id,
    {
      statistics: {
        totalTrips,
        totalPassengers,
        averageRating,
        onTimePerformance
      }
    },
    { new: true }
  ).lean();

  if (!bus) {
    return res.status(404).json({ message: 'Bus not found' });
  }

  res.json(bus);
}));

module.exports = router; 