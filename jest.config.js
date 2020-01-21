module.exports = {
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts?(x)'],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  setupFiles: ['<rootDir>/test/setupFiles.ts'],

  // Setup Enzyme
  snapshotSerializers: ['enzyme-to-json/serializer'],
  setupFilesAfterEnv: ['<rootDir>/test/setupEnzyme.ts'],
};
