import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { debounce } from 'lodash';

const BusMap = ({ buses, selectedBus, onBusSelect, onViewDetails }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [map, setMap] = useState(null);
  const [markerSize, setMarkerSize] = useState(null);

  const mapStyles = {
    height: "60vh",
    width: "100%"
  };

  const defaultCenter = {
    lat: parseFloat(import.meta.env.VITE_UNIVERSITY_LAT || 28.7041),
    lng: parseFloat(import.meta.env.VITE_UNIVERSITY_LNG || 77.1025)
  };

  const getMarkerIcon = useCallback((status) => {
    if (!markerSize) return null;

    const iconUrl = (() => {
      switch(status) {
        case 'Delayed':
          return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
        case 'Out of Service':
        case 'Maintenance':
          return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
        case 'Emergency':
          return 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';
        default:
          return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
      }
    })();

    return {
      url: iconUrl,
      scaledSize: markerSize
    };
  }, [markerSize]);

  // Handle map bounds changes
  const handleMapIdle = useCallback(
    debounce(() => {
      if (map) {
        const bounds = map.getBounds();
        if (bounds) {
          console.log('Map bounds:', bounds.toString());
        }
      }
    }, 1000),
    [map]
  );

  // Center map on selected bus
  useEffect(() => {
    if (map && selectedBus?.currentLocation) {
      map.panTo(selectedBus.currentLocation);
      map.setZoom(15);
    }
  }, [selectedBus, map]);

  const handleMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    setMapLoaded(true);
    // Set marker size after Google Maps is loaded
    if (window.google) {
      setMarkerSize(new window.google.maps.Size(30, 30));
    }
  }, []);

  const handleMapError = useCallback((error) => {
    console.error('Map loading error:', error);
    setMapError('Failed to load map');
  }, []);

  if (mapError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-lg bg-white p-4">
      <h2 className="text-xl font-bold mb-4">Live Bus Locations</h2>
      {!mapLoaded && (
        <div className="flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onError={handleMapError}
      >
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
          onLoad={handleMapLoad}
          onIdle={handleMapIdle}
          options={{
            fullscreenControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            styles: [] // Add custom map styles here if needed
          }}
        >
          {mapLoaded && buses.map(bus => {
            const icon = getMarkerIcon(bus.status);
            if (!icon) return null;

            return (
              <Marker
                key={bus._id}
                position={bus.currentLocation}
                icon={icon}
                onClick={() => onBusSelect(bus)}
              />
            );
          })}

          {selectedBus && mapLoaded && (
            <InfoWindow
              position={selectedBus.currentLocation}
              onCloseClick={() => onBusSelect(null)}
            >
              <div className="min-w-[200px]">
                <h3 className="font-bold text-lg">Bus {selectedBus.busNumber}</h3>
                <div className="mt-2 space-y-1">
                  <p>Route: {selectedBus.routeName}</p>
                  <p>Status: <span className={
                    selectedBus.status === 'On Route' ? 'text-green-600' :
                    selectedBus.status === 'Delayed' ? 'text-yellow-600' : 'text-red-600'
                  }>{selectedBus.status}</span></p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(selectedBus);
                    }}
                    className="mt-2 w-full px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default BusMap; 