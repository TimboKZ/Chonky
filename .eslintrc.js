module.exports = {
    parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        project: './tsconfig.json',
    },
    rules: {
        'indent': 'off',
        'react/display-name': 0,
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/strict-boolean-expressions': 2,
        '@typescript-eslint/explicit-function-return-type': 'off',
    },
};