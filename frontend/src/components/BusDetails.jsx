import { useState } from 'react';
import BusStats from './BusStats';
import BusAlerts from './BusAlerts';
import DriverInfo from './DriverInfo';

const BusDetails = ({ bus }) => {
  const [activeTab, setActiveTab] = useState('info');

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delayed': return 'text-yellow-600 bg-yellow-50';
      case 'Out of Service':
      case 'Maintenance': return 'text-red-600 bg-red-50';
      case 'Emergency': return 'text-purple-600 bg-purple-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Bus {bus.busNumber}</h2>
              <p className="text-gray-600">{bus.routeName}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bus.status)}`}>
              {bus.status}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b px-6">
          <nav className="-mb-px flex space-x-6">
            {['info', 'stats', 'alerts', 'driver'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'info' && (
            <div className="grid grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Manufacturer</p>
                    <p className="font-medium">{bus.vehicle.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Model</p>
                    <p className="font-medium">{bus.vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-medium">{bus.vehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mileage</p>
                    <p className="font-medium">{bus.vehicle.mileage} km</p>
                  </div>
                </div>
              </div>

              {/* Capacity Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Current Status</h3>
                <div>
                  <p className="text-sm text-gray-500">Passenger Capacity</p>
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${(bus.capacity.current / bus.capacity.total) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm mt-1">
                      {bus.capacity.current}/{bus.capacity.total} passengers
                      {bus.capacity.standing > 0 && ` (${bus.capacity.standing} standing)`}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(bus.features).map(([feature, available]) => (
                      available && (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm"
                        >
                          {feature.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && <BusStats bus={bus} />}
          {activeTab === 'alerts' && <BusAlerts bus={bus} />}
          {activeTab === 'driver' && <DriverInfo driver={bus.driver} />}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
          <button
            onClick={() => onClose()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusDetails; 