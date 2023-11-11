// OpenWeatherMap API key
    const apiKey = '2e73239fa8366c87781fe87f79d99170';
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=' + apiKey;

    let temperatures = [];

    function getCurrentTemperature() {
      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            const currentTemperature = data.main.temp;
            document.getElementById('temperature').innerText = currentTemperature.toFixed(2);

            const now = new Date();
            const date = now.toLocaleDateString();
            const time = now.toLocaleTimeString();

            const table = document.getElementById('data-table');
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
          })
          .catch(error => console.error('Error fetching weather data:', error));
      }
    }

    function drawChart() {
        // delete the old is destroyed before being reused to avoid console error
        const existingChart = window.Chart.getChart('temperature-chart');
        if (existingChart) {
            existingChart.destroy();
        }

      const ctx = document.getElementById('temperature-chart').getContext('2d');
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

    // Get initial temperature
    getCurrentTemperature();

    // Check temperature every 10 seconds
    setInterval(getCurrentTemperature, 10000);
