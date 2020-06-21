module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:prettier/recommended',
        'prettier',
    ],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    plugins: [
        'react',
        'import',
        '@typescript-eslint',
        'prettier',
        'simple-import-sort',
    ],
    rules: {
        quotes: ['warn', 'single', { allowTemplateLiterals: true }],
        'no-console': 'warn',
        'no-unused-vars': 'warn',
        'no-prototype-builtins': 'off',
        'sort-imports': [
            'error',
            {
                ignoreCase: true,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
            },
        ],
        'simple-import-sort/sort': 'error',
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react-hooks/exhaustive-deps': 'error',
        'import/first': 'error',
        'import/no-unresolved': 'off',
        'import/no-namespace': 'error',
        'import/no-duplicates': 'error',
        'import/no-default-export': 'error',
        'import/no-internal-modules': 'off',
        'import/newline-after-import': 'error',
        'import/no-useless-path-segments': 'error',
        'import/order': [
            'error',
            {
                groups: ['builtin', 'external', 'parent', 'index', 'sibling'],
            },
        ],
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/explicit-member-accessibility': 'error',
        'prettier/prettier': 'off',
    },
    settings: {
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
        react: {
            version: 'detect',
        },
    },
};
