module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['!**/*.acceptance.test.ts', '!**/*.integration.test.ts', '!**/__test_assets__/**/*.ts', '**/*.test.ts'],
  setupFiles: ['core-js'],
  preset: 'ts-jest',
  verbose: true,
};
