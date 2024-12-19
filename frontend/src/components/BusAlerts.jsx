import { useState } from 'react';

const BusAlerts = ({ bus }) => {
  const [showResolved, setShowResolved] = useState(false);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredAlerts = bus.alerts.filter(alert => 
    showResolved ? true : !alert.resolved
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Bus Alerts & Maintenance</h3>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
            className="mr-2"
          />
          Show Resolved
        </label>
      </div>

      {/* Maintenance Info */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800">Maintenance Status</h4>
        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
          <div>
            <p className="text-gray-600">Last Maintenance</p>
            <p className="font-medium">
              {new Date(bus.vehicle.lastMaintenance).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Next Maintenance</p>
            <p className="font-medium">
              {new Date(bus.vehicle.nextMaintenance).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Fuel Level</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${bus.vehicle.fuelLevel}%` }}
              ></div>
            </div>
          </div>
          <div>
            <p className="text-gray-600">Mileage</p>
            <p className="font-medium">{bus.vehicle.mileage} km</p>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-2">
        {filteredAlerts.map((alert, index) => (
          <div
            key={index}
            className={`p-3 border rounded-lg ${getSeverityColor(
              alert.severity
            )}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{alert.type}</p>
                <p className="text-sm">{alert.message}</p>
              </div>
              <span className="text-xs">
                {new Date(alert.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusAlerts; 