const WebSocket = require('ws');
const Bus = require('../models/Bus');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    // Send initial bus data
    Bus.find().lean().then(buses => {
      ws.send(JSON.stringify({ type: 'INITIAL_DATA', data: buses }));
    });

    ws.on('message', async (message) => {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'UPDATE_LOCATION':
          try {
            const updatedBus = await Bus.findByIdAndUpdate(
              data.busId,
              { 
                currentLocation: data.location,
                lastUpdated: new Date()
              },
              { new: true }
            ).lean();

            // Broadcast to all clients
            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'BUS_UPDATED',
                  data: updatedBus
                }));
              }
            });
          } catch (error) {
            ws.send(JSON.stringify({
              type: 'ERROR',
              message: error.message
            }));
          }
          break;

        // Add more cases for different types of messages
      }
    });
  });

  return wss;
}

module.exports = setupWebSocket; 