import fetchMock from 'jest-fetch-mock';
import Chart from 'chart.js/auto';
import { getCurrentTemperature, drawChart } from './weatherApp';

jest.mock('chart.js/auto'); // Mock the entire Chart.js module
jest.mock('node-fetch');

fetchMock.enableMocks();

describe('getCurrentTemperature', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    document.body.innerHTML = `
      <div>
        <span id="temperature"></span>
        <table>
          <tbody id="data-table"></tbody>
        </table>
      </div>
      <div id="chart-container">
        <canvas id="temperature-chart"></canvas>
      </div>
    `;
    jest.spyOn(global, 'Date').mockImplementation(() => ({
      getTime: jest.fn(() => 1234567890),
      toLocaleDateString: jest.fn(() => '2023-01-01'),
      toLocaleTimeString: jest.fn(() => '12:00:00'),
    }));
  });

  test('getCurrentTemperature should update temperature and add a row to the table', async () => {
    // Mock the fetch function
    const fetchSpy = jest.spyOn(global, 'fetch');
    fetchMock.mockResponseOnce(JSON.stringify({ main: { temp: 25 } }));

    // Wait for the asynchronous code to complete
    await getCurrentTemperature();

    // Check if fetch is called with the correct URL
    expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('London'));
    // Check if temperature is updated
    const temperatureElement = document.getElementById('temperature');
    expect(temperatureElement.innerText).toBe('25.00');

    // Check if a row is added to the table
    const tableRows = document.querySelectorAll('#data-table tr');
    expect(tableRows.length).toBe(1);

    const tableCells = tableRows[0].querySelectorAll('td');
    expect(tableCells.length).toBe(3);
    expect(tableCells[0].innerText).toBe('2023-01-01');
    expect(tableCells[1].innerText).toBe('12:00:00');
    expect(tableCells[2].innerText).toBe('25.00');
  });

  test('getCurrentTemperature should handle fetch error', async () => {
    fetchMock.mockReject(new Error('Fetch error'));

    // Mock console.error to track if it's called
    jest.spyOn(console, 'error').mockImplementation();

    await getCurrentTemperature();

    // Check if console.error is called with the correct error message
    expect(console.error).toHaveBeenCalledWith('Error fetching weather data:', expect.any(Error));
  });
  afterEach(() => {
    fetchMock.resetMocks();
  });
});

describe('drawChart', () => {
  test('drawChart should destroy existing chart and create a new one', () => {
    // Mock the Chart object
    const mockChartInstance = { destroy: jest.fn() };
    Chart.getChart.mockReturnValueOnce(mockChartInstance);

    drawChart();

    // Check if the existing chart is destroyed
    expect(Chart.getChart).toHaveBeenCalledWith('temperature-chart');
    expect(mockChartInstance.destroy).toHaveBeenCalled();

    // Check if Chart is called with the correct parameters
    expect(Chart).toHaveBeenCalledWith(expect.anything(), {
      type: 'line',
      data: expect.anything(),
      options: expect.anything(),
    });
  });
});
