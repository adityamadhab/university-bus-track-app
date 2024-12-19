import { useEffect, useCallback } from 'react';
import { wsService } from '../services/websocket';
import { toast } from 'react-toastify';

export const useWebSocket = (onBusUpdate) => {
  const handleMessage = useCallback((data) => {
    switch (data.type) {
      case 'INITIAL_DATA':
        onBusUpdate(data.data);
        break;
      case 'BUS_UPDATED':
        onBusUpdate(prev => 
          prev.map(bus => 
            bus._id === data.data._id ? data.data : bus
          )
        );
        if (data.data.alerts?.length > 0) {
          const latestAlert = data.data.alerts[data.data.alerts.length - 1];
          toast.info(`Bus ${data.data.busNumber}: ${latestAlert.message}`);
        }
        break;
      case 'ERROR':
        toast.error(data.message);
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }, [onBusUpdate]);

  useEffect(() => {
    wsService.connect();
    const unsubscribe = wsService.subscribe(handleMessage);
    
    return () => {
      unsubscribe();
    };
  }, [handleMessage]);

  return wsService;
}; 