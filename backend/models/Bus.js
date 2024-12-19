const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: { type: String, required: true },
  message: { type: String, required: true },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'],
    required: true 
  },
  timestamp: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false }
});

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true },
  routeName: { type: String, required: true },
  currentLocation: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
    heading: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['On Route', 'Delayed', 'Out of Service', 'Maintenance', 'Emergency'],
    default: 'On Route'
  },
  schedule: [{
    stopName: String,
    arrivalTime: String,
    completed: { type: Boolean, default: false },
    actualArrivalTime: Date,
    delayMinutes: { type: Number, default: 0 }
  }],
  driver: {
    name: String,
    phone: String,
    licenseNumber: String,
    shiftStart: Date,
    shiftEnd: Date,
    rating: { type: Number, min: 1, max: 5 }
  },
  vehicle: {
    manufacturer: String,
    model: String,
    year: Number,
    lastMaintenance: Date,
    nextMaintenance: Date,
    fuelLevel: { type: Number, min: 0, max: 100 },
    mileage: Number
  },
  capacity: {
    total: { type: Number, default: 40 },
    current: { type: Number, default: 0 },
    standing: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  features: {
    wheelchair: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    airConditioned: { type: Boolean, default: false },
    usbCharging: { type: Boolean, default: false }
  },
  statistics: {
    totalTrips: { type: Number, default: 0 },
    totalPassengers: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    onTimePerformance: { type: Number, default: 0 }
  },
  alerts: [alertSchema],
  isActive: { type: Boolean, default: true },
  lastUpdated: { type: Date, default: Date.now },
  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bus', busSchema); 