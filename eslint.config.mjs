import rocketseatConfig from '@rocketseat/eslint-config/node.mjs'

export default [
  ...rocketseatConfig,
  {
    ignores: ['node_modules', 'dist'],
  },
  {
    rules: {
      'no-useless-constructor': 'off',
    },
  },
]
