import pluginJs from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
  },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  stylistic.configs.customize({
    flat: true,
    indent: 2,
    quotes: 'single',
    semi: false,
    jsx: false,
  }),
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs'],
    },
  },
]
