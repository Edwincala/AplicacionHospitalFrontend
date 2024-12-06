import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'build', 'node_modules'] },
  {
    extends: [js.configs.recommended,
        ...tseslint.configs.recommended,
        'plugin:prettier/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
        react: {
            version: 'detect',
        }
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
        'react/prop-types': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', {argsIgnorePattern: '^_'}],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
)
