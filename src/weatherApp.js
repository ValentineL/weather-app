import Chart from 'chart.js/auto';
import './styles.css'; 

const apiKey = '2e73239fa8366c87781fe87f79d99170';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=' + apiKey;

let temperatures = [];

export async function getCurrentTemperature() {
  if (typeof global.fetch !== 'undefined') {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data.main || !data.main.temp) {
        throw new Error('Temperature data is missing in the API response.');
      }

      const currentTemperature = data.main.temp;

      const temperatureElement = document.getElementById('temperature');
      if (temperatureElement) {
        temperatureElement.innerText = currentTemperature.toFixed(2);
      } else {
        console.error('Error: temperature element not found');
      }

      const now = new Date();
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString();

      const table = document.getElementById('data-table');
      if (table) {
        const row = table.insertRow(0);
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);

        cell1.innerText = date;
        cell2.innerText = time;
        cell3.innerText = currentTemperature.toFixed(2);

        temperatures.unshift(currentTemperature);

        if (temperatures.length > 100) {
          temperatures.pop();
        }

        drawChart();
      } else {
        console.error('Error: data-table element not found');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }
}

export function drawChart() {
  // Ensure that the mocked Chart object is used
  const existingChart = Chart.getChart('temperature-chart');
  if (existingChart) {
    existingChart.destroy();
  }

  const chartElement = document.getElementById('temperature-chart');
  if (chartElement) {
    const ctx = chartElement.getContext('2d');
    const labels = Array.from({ length: temperatures.length }, (_, i) => '');
    const data = {
      labels: labels,
      datasets: [{
        label: 'Temperature',
        data: temperatures,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };

    // Create a new chart using the installed Chart.js package
    new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom'
          }
        }
      }
    });
  }
}


// Get initial temperature
getCurrentTemperature();

// Check temperature every 10 seconds
setInterval(getCurrentTemperature, 10000);
