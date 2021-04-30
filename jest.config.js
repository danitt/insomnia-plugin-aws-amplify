module.exports = {
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['<rootDir>/src/**/*.(test|spec).(ts|js)', '<rootDir>/test/**/*.(test|spec).(ts|js)'],
  testEnvironment: 'node',
};
