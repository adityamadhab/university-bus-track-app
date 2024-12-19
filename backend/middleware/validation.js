const { AppError } = require('../utils/errorHandlers');

const validateBusUpdate = (req, res, next) => {
  const { location, status, capacity } = req.body;

  if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    return next(new AppError('Invalid location data', 400));
  }

  if (status && !['On Route', 'Delayed', 'Out of Service', 'Maintenance', 'Emergency'].includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  if (capacity && (typeof capacity !== 'number' || capacity < 0)) {
    return next(new AppError('Invalid capacity', 400));
  }

  next();
};

const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || username.length < 3) {
    return next(new AppError('Username must be at least 3 characters long', 400));
  }

  if (!email || !email.includes('@')) {
    return next(new AppError('Please provide a valid email', 400));
  }

  if (!password || password.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400));
  }

  next();
};

module.exports = {
  validateBusUpdate,
  validateRegistration
}; 