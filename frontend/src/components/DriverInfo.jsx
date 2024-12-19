import { useState } from 'react';

const DriverInfo = ({ driver }) => {
  const [showContact, setShowContact] = useState(false);

  const getShiftStatus = () => {
    const now = new Date();
    const shiftStart = new Date(driver.shiftStart);
    const shiftEnd = new Date(driver.shiftEnd);
    
    if (now >= shiftStart && now <= shiftEnd) {
      return 'On Duty';
    }
    return 'Off Duty';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Driver Information</h3>
        <span className={`px-2 py-1 rounded text-sm ${
          getShiftStatus() === 'On Duty' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {getShiftStatus()}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-gray-600 text-sm">Driver Name</p>
          <p className="font-medium">{driver.name}</p>
        </div>

        <div>
          <p className="text-gray-600 text-sm">License Number</p>
          <p className="font-medium">{driver.licenseNumber}</p>
        </div>

        <div>
          <p className="text-gray-600 text-sm">Shift Hours</p>
          <p className="font-medium">
            {new Date(driver.shiftStart).toLocaleTimeString()} - 
            {new Date(driver.shiftEnd).toLocaleTimeString()}
          </p>
        </div>

        <div>
          <p className="text-gray-600 text-sm">Rating</p>
          <div className="flex items-center">
            <span className="text-2xl font-bold mr-2">{driver.rating}</span>
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= driver.rating ? 'fill-current' : 'text-gray-300'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        <div>
          <button
            className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
            onClick={() => setShowContact(!showContact)}
          >
            {showContact ? 'Hide Contact' : 'Show Contact'}
          </button>
          {showContact && (
            <p className="mt-2 text-center font-medium">{driver.phone}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverInfo; 