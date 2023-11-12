import 'jest-fetch-mock';
import 'resize-observer-polyfill';
import 'jest-canvas-mock';
import './__mocks__/chart.mock';

global.ResizeObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));
  
// Mock the global window object
global.window = {
    Chart: {
        getChart: jest.fn((chartId) => {
        // Mock the behavior of getChart based on the chartId
        return {
            destroy: jest.fn(),
        };
        }),
    },
};
  