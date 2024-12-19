import { useState } from 'react';

const BusFilter = ({ onFilterChange }) => {
  const [expanded, setExpanded] = useState(false);

  const handleInputChange = (field, value) => {
    onFilterChange(field, value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Filters</h3>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-600 hover:text-blue-800"
        >
          {expanded ? 'Show Less' : 'Show More'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <select
          onChange={(e) => handleInputChange('status', e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Statuses</option>
          <option value="On Route">On Route</option>
          <option value="Delayed">Delayed</option>
          <option value="Out of Service">Out of Service</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Emergency">Emergency</option>
        </select>

        <select
          onChange={(e) => handleInputChange('isActive', e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Buses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        <input
          type="text"
          placeholder="Search by route or bus number..."
          onChange={(e) => handleInputChange('search', e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      {expanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <select
            onChange={(e) => handleInputChange('features', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Features</option>
            <option value="wheelchair">Wheelchair Access</option>
            <option value="wifi">WiFi Available</option>
            <option value="airConditioned">Air Conditioned</option>
            <option value="usbCharging">USB Charging</option>
          </select>

          <select
            onChange={(e) => handleInputChange('capacity', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Any Capacity</option>
            <option value="available">Seats Available</option>
            <option value="full">Full</option>
            <option value="almostFull">Almost Full</option>
          </select>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasAlerts"
              onChange={(e) => handleInputChange('hasAlerts', e.target.checked)}
              className="rounded text-blue-600"
            />
            <label htmlFor="hasAlerts">Has Active Alerts</label>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusFilter; 