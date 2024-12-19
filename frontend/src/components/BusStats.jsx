import { Line, Bar } from 'react-chartjs-2';

const BusStats = ({ bus }) => {
  const performanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'On-Time Performance',
        data: Array(7).fill().map(() => Math.floor(Math.random() * 20) + 80),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const passengerData = {
    labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
    datasets: [
      {
        label: 'Average Passengers',
        data: Array(6).fill().map(() => Math.floor(Math.random() * 30) + 10),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Performance Statistics</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <Line data={performanceData} options={{ responsive: true }} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Passenger Flow</h3>
        <div className="bg-white p-4 rounded-lg shadow">
          <Bar data={passengerData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-semibold text-gray-600">Total Trips</h4>
          <p className="text-2xl font-bold">{bus.statistics.totalTrips}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-semibold text-gray-600">Average Rating</h4>
          <p className="text-2xl font-bold">{bus.statistics.averageRating}/5</p>
        </div>
      </div>
    </div>
  );
};

export default BusStats; 