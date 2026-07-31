import next from 'eslint-config-next'

// Named rather than an inline anonymous array: eslint-plugin-import's
// no-anonymous-default-export rule (enabled by eslint-config-next) flags
// this file otherwise.
const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...next,
]

export default config
