import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics = () => {
  const [selectedMonth, setSelectedMonth] = useState(''); // State for the selected month
  const [statistics, setStatistics] = useState(null); // State for the statistics data
  const [error, setError] = useState(null); // State for handling errors

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      if (selectedMonth) {
        try {
          const response = await axios.get(`http://localhost:8000/api/statisticsByMonth?month=${selectedMonth}`);
          setStatistics(response.data);
          setError(null);
        } catch (err) {
          setError('Failed to fetch statistics. Please try again later.');
          setStatistics(null);
        }
      }
    };

    fetchStatistics();
  }, [selectedMonth]);

  // Function to get month name from month number
  const getMonthName = (monthNumber) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthNumber - 1];
  };

  // Prepare data for the bar chart
  const chartData = {
    labels: statistics ? statistics.priceDistribution.map(item => item.priceRange) : [],
    datasets: [
      {
        label: 'Number of Items Sold',
        data: statistics ? statistics.priceDistribution.map(item => item.count) : [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Bar Chart Stats -  ' + (selectedMonth ? getMonthName(parseInt(selectedMonth)) : ''),
      },
    },
  };

  return (
    <div className="my-4">
      <div className="d-flex align-items-center mb-3">
        <label className="form-label mr-2">Select Month:</label>
        <select 
          value={selectedMonth} 
          onChange={handleMonthChange} 
          className="form-select" 
          style={{ maxWidth: '150px' }} // Set a maximum width for the dropdown
        >
          <option value="">--Select Month--</option>
          {[...Array(12).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
          ))}
        </select>
      </div>

      {statistics && (
        <div className="statistics-box p-4 rounded" style={{ backgroundColor: '#fbe7a1', maxWidth: '400px' }}>
          <h4>Statistics - {getMonthName(parseInt(selectedMonth))}</h4>
          <p><strong>Total Sale: $</strong> {statistics.totalSaleAmount}</p>
          <p><strong>Total Sold Items:</strong> {statistics.totalSoldItems}</p>
          <p><strong>Total Not Sold Items:</strong> {statistics.totalNotSoldItems}</p>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {statistics && statistics.priceDistribution && (
        <div className="chart-container mt-4">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default Statistics;
