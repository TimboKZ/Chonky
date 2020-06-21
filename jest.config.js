const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./stories/tsconfig.stories.json');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleDirectories: ['.', 'src/', 'stories/', 'test/', 'node_modules'],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    globals: {
        'ts-jest': {
            tsConfig: 'tsconfig.stories.json',
        },
    },
};
