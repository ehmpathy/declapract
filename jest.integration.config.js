module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['!**/__test_assets__/**/*.ts', '**/*.integration.test.ts'],
  setupFiles: ['core-js'],
  setupFilesAfterEnv: ['./jest.integration.env.js'],
  preset: 'ts-jest/presets/js-with-babel',
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  verbose: true,
};
