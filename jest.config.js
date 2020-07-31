const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./stories/tsconfig.json');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'enzyme',
    setupFilesAfterEnv: ['jest-enzyme'],
    moduleDirectories: ['.', 'src/', 'stories/', 'test/', 'node_modules'],
    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths),
        '\\.(css|less|sass|scss)$': '<rootDir>/test/__mocks__/styleMock.ts',
    },
    globals: {
        'ts-jest': {
            tsConfig: 'stories/tsconfig.json',
        },
    },
};
