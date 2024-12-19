const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const { catchAsync } = require('../utils/errorHandlers');
const Bus = require('../models/Bus');
const Route = require('../models/Route');
const User = require('../models/User');

// Protect all admin routes
router.use(protect);
router.use(restrictTo('admin'));

// Get dashboard statistics
router.get('/stats', catchAsync(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [
    activeBuses,
    totalPassengersToday,
    routes,
    alerts,
    hourlyPassengers,
    routeUtilization
  ] = await Promise.all([
    Bus.countDocuments({ status: 'On Route' }),
    Bus.aggregate([
      {
        $match: {
          'capacity.lastUpdated': { $gte: startOfDay }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$capacity.current' }
        }
      }
    ]),
    Route.countDocuments({ active: true }),
    Bus.countDocuments({ 'alerts.active': true }),
    Bus.aggregate([
      {
        $match: {
          'capacity.lastUpdated': { $gte: startOfDay }
        }
      },
      {
        $group: {
          _id: { $hour: '$capacity.lastUpdated' },
          count: { $sum: '$capacity.current' }
        }
      },
      {
        $project: {
          hour: '$_id',
          count: 1,
          _id: 0
        }
      },
      { $sort: { hour: 1 } }
    ]),
    Route.aggregate([
      {
        $lookup: {
          from: 'buses',
          localField: '_id',
          foreignField: 'route',
          as: 'buses'
        }
      },
      {
        $project: {
          routeName: 1,
          passengerCount: {
            $sum: '$buses.capacity.current'
          }
        }
      }
    ])
  ]);

  res.json({
    activeBuses,
    totalPassengersToday: totalPassengersToday[0]?.total || 0,
    routes,
    alerts,
    hourlyPassengers,
    routeUtilization
  });
}));

// Manage buses
router.get('/buses', catchAsync(async (req, res) => {
  const buses = await Bus.find().lean();
  res.json(buses);
}));

router.post('/buses', catchAsync(async (req, res) => {
  const newBus = await Bus.create(req.body);
  res.status(201).json(newBus);
}));

router.patch('/buses/:id', catchAsync(async (req, res) => {
  const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.json(bus);
}));

router.delete('/buses/:id', catchAsync(async (req, res) => {
  await Bus.findByIdAndDelete(req.params.id);
  res.status(204).json(null);
}));

// Manage routes
router.get('/routes', catchAsync(async (req, res) => {
  const routes = await Route.find().lean();
  res.json(routes);
}));

router.post('/routes', catchAsync(async (req, res) => {
  const newRoute = await Route.create(req.body);
  res.status(201).json(newRoute);
}));

router.patch('/routes/:id', catchAsync(async (req, res) => {
  const route = await Route.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.json(route);
}));

router.delete('/routes/:id', catchAsync(async (req, res) => {
  await Route.findByIdAndDelete(req.params.id);
  res.status(204).json(null);
}));

// Manage users
router.get('/users', catchAsync(async (req, res) => {
  const users = await User.find().select('-password').lean();
  res.json(users);
}));

router.patch('/users/:id', catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).select('-password');
  res.json(user);
}));

router.delete('/users/:id', catchAsync(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).json(null);
}));

module.exports = router; 