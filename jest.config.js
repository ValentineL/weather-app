module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.js$': 'babel-jest',
        },
    setupFiles: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '\\.css$': '<rootDir>/styleMock.js', // Mocking CSS files
    },
};
