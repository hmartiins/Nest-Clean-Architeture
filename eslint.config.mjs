import rocketseatConfig from '@rocketseat/eslint-config/node.mjs'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  ...rocketseatConfig,
  eslintConfigPrettier,
  {
    ignores: ['node_modules', 'dist'],
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-new': 'off',
      'no-useless-constructor': 'off',
      '@stylistic/max-len': 'off', // Prettier handles this
    },
  },
]
