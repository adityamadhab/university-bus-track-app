import { useState, useEffect } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { fetchBusData } from '../services/api';
import { toast } from 'react-toastify';
import BusMap from './BusMap';
import BusList from './BusList';
import BusFilter from './BusFilter';
import BusStats from './BusStats';
import BusAlerts from './BusAlerts';
import DriverInfo from './DriverInfo';

const BusTracker = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize WebSocket connection
  const ws = useWebSocket((data) => {
    if (data.type === 'INITIAL_DATA') {
      setBuses(data.data);
      setLoading(false);
    } else if (data.type === 'BUS_UPDATED') {
      setBuses(prev => prev.map(bus => 
        bus._id === data.data._id ? data.data : bus
      ));
    }
  });

  // Initial data fetch
  useEffect(() => {
    const loadBuses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchBusData(filters);
        setBuses(data.buses || []);
      } catch (err) {
        setError('Failed to load bus data');
        toast.error('Failed to load bus data');
      } finally {
        setLoading(false);
      }
    };

    loadBuses();
  }, [filters]);

  const handleBusSelect = (bus) => {
    setSelectedBus(prev => prev?._id === bus._id ? null : bus);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button 
            onClick={() => window.location.reload()}
            className="ml-4 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 space-y-4">
      <BusFilter onFilterChange={handleFilterChange} />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Bus List Section */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4">Bus List</h2>
            <BusList 
              buses={buses} 
              selectedBus={selectedBus}
              onBusSelect={handleBusSelect}
            />
          </div>

          {/* Selected Bus Details */}
          {selectedBus && (
            <div className="grid md:grid-cols-3 gap-4">
              {/* Map */}
              <div className="md:col-span-2">
                <BusMap 
                  buses={[selectedBus]} 
                  selectedBus={selectedBus}
                  onBusSelect={handleBusSelect}
                />
              </div>

              {/* Driver Info */}
              <div>
                {selectedBus.driver && (
                  <DriverInfo driver={selectedBus.driver} />
                )}
              </div>

              {/* Stats and Alerts */}
              <div className="md:col-span-2">
                <BusStats bus={selectedBus} />
              </div>
              <div>
                <BusAlerts bus={selectedBus} />
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default BusTracker; 