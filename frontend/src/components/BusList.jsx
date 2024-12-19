import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BusList = ({ buses, selectedBus, onBusSelect }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Delayed':
        return 'text-yellow-600 bg-yellow-50';
      case 'Out of Service':
      case 'Maintenance':
        return 'text-red-600 bg-red-50';
      case 'Emergency':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence>
        {buses.map(bus => (
          <motion.div
            key={bus._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedBus?._id === bus._id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onBusSelect(bus)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Bus {bus.busNumber}</h3>
                <p className="text-sm text-gray-600">{bus.routeName}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(bus.status)}`}>
                {bus.status}
              </span>
            </div>

            <div className="mt-2 space-y-2">
              <div>
                <p className="text-sm text-gray-600">Passengers</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(bus.capacity.current / bus.capacity.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1">
                  {bus.capacity.current}/{bus.capacity.total}
                </p>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Next Stop: {bus.schedule[0]?.stopName || 'N/A'}
                </span>
                <span className="text-gray-600">
                  {bus.schedule[0]?.arrivalTime || 'N/A'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default BusList; 