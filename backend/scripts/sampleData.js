const mongoose = require('mongoose');
const Bus = require('../models/Bus');
const Route = require('../models/Route');

const sampleData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bus-tracker');

    // Clear existing data
    await Bus.deleteMany({});
    await Route.deleteMany({});

    // Create sample routes
    const routes = await Route.create([
      {
        name: 'Campus Loop',
        description: 'Main campus circular route',
        stops: [
          { 
            name: 'Main Gate', 
            location: { lat: 28.7041, lng: 77.1025 }, 
            isMainStop: true,
            estimatedTime: '5 mins' 
          },
          { 
            name: 'Library', 
            location: { lat: 28.7045, lng: 77.1028 },
            estimatedTime: '3 mins'
          },
          { 
            name: 'Student Center', 
            location: { lat: 28.7048, lng: 77.1030 },
            estimatedTime: '4 mins'
          }
        ]
      },
      {
        name: 'Hostel Route',
        description: 'Connects all hostel blocks to main campus',
        stops: [
          { 
            name: 'Boys Hostel', 
            location: { lat: 28.7060, lng: 77.1040 },
            isMainStop: true,
            estimatedTime: '5 mins'
          },
          { 
            name: 'Girls Hostel', 
            location: { lat: 28.7065, lng: 77.1045 },
            isMainStop: true,
            estimatedTime: '4 mins'
          }
        ]
      }
    ]);

    // Create sample buses
    const buses = await Bus.create([
      {
        busNumber: 'UNI-001',
        routeName: 'Campus Loop',
        currentLocation: { 
          lat: 28.7041, 
          lng: 77.1025,
          speed: 35,
          heading: 90
        },
        status: 'On Route',
        schedule: [
          { 
            stopName: 'Main Gate', 
            arrivalTime: '09:00 AM',
            completed: true,
            actualArrivalTime: new Date(),
            delayMinutes: 0
          },
          { 
            stopName: 'Library', 
            arrivalTime: '09:15 AM'
          }
        ],
        driver: {
          name: 'John Doe',
          phone: '1234567890',
          licenseNumber: 'DL12345',
          shiftStart: new Date().setHours(8, 0),
          shiftEnd: new Date().setHours(16, 0),
          rating: 4.5
        },
        vehicle: {
          manufacturer: 'Tata',
          model: 'Starbus',
          year: 2022,
          lastMaintenance: new Date(),
          nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          fuelLevel: 75,
          mileage: 15000
        },
        capacity: {
          total: 40,
          current: 25,
          standing: 10
        },
        features: {
          wheelchair: true,
          wifi: true,
          airConditioned: true,
          usbCharging: true
        },
        statistics: {
          totalTrips: 150,
          totalPassengers: 3500,
          averageRating: 4.3,
          onTimePerformance: 92
        },
        alerts: [{
          type: 'Delay',
          message: 'Traffic congestion at Main Gate',
          severity: 'Medium',
          timestamp: new Date(),
          resolved: false
        }]
      },
      {
        busNumber: 'UNI-002',
        routeName: 'Hostel Route',
        currentLocation: { 
          lat: 28.7060, 
          lng: 77.1040,
          speed: 28,
          heading: 180
        },
        status: 'On Route',
        schedule: [
          { 
            stopName: 'Boys Hostel', 
            arrivalTime: '09:30 AM'
          },
          { 
            stopName: 'Girls Hostel', 
            arrivalTime: '09:45 AM'
          }
        ],
        driver: {
          name: 'Jane Smith',
          phone: '9876543210',
          licenseNumber: 'DL54321',
          shiftStart: new Date().setHours(9, 0),
          shiftEnd: new Date().setHours(17, 0),
          rating: 4.8
        },
        vehicle: {
          manufacturer: 'Ashok Leyland',
          model: 'Falcon',
          year: 2021,
          lastMaintenance: new Date(),
          nextMaintenance: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          fuelLevel: 60,
          mileage: 12000
        },
        capacity: {
          total: 35,
          current: 30,
          standing: 5
        },
        features: {
          wheelchair: true,
          wifi: true,
          airConditioned: true,
          usbCharging: true
        },
        statistics: {
          totalTrips: 120,
          totalPassengers: 2800,
          averageRating: 4.5,
          onTimePerformance: 88
        }
      }
    ]);

    console.log('Sample data created successfully');
    console.log(`Created ${routes.length} routes and ${buses.length} buses`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample data:', error);
    process.exit(1);
  }
};

sampleData(); 