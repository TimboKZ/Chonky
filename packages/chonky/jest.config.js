module.exports = {
    preset: 'ts-jest',
    coverageProvider: 'v8',
    coverageDirectory: 'coverage',
    setupFilesAfterEnv: ['<rootDir>/test/setup-tests.ts'],
};
