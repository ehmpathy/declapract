import type { Config } from 'jest';

// https://jestjs.io/docs/configuration
const config: Config = {
  verbose: true,
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // https://kulshekhar.github.io/ts-jest/docs/getting-started/presets
  },
  testMatch: ['**/*.integration.test.ts'],
  setupFiles: ['core-js'],
  setupFilesAfterEnv: ['./jest.integration.env.ts'],
  transformIgnorePatterns: [
    '<rootDir>/*/node_modules/(?!declapract-typescript-ehmpathy/)',
  ],
};

// eslint-disable-next-line import/no-default-export
export default config;
