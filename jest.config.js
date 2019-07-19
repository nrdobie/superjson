module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  roots: [
    '<rootDir>',
    `${__dirname}/jest`
  ],
  errorOnDeprecated: true,
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  testMatch: [ '**/src/**/__tests__/*.test.ts' ],
  setupFilesAfterEnv: [`${__dirname}/jest/setup.ts`]
}
