const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  active: { type: Boolean, default: true },
  stops: [{
    name: String,
    location: {
      lat: Number,
      lng: Number
    },
    estimatedTime: String,
    isMainStop: { type: Boolean, default: false }
  }],
  activeDrivers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus'
  }],
  schedule: {
    weekday: [{
      departureTime: String,
      type: { type: String, enum: ['Regular', 'Express'] }
    }],
    weekend: [{
      departureTime: String,
      type: { type: String, enum: ['Regular', 'Express'] }
    }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Route', routeSchema); 