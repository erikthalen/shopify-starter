import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { ignores: ['assets/*', 'docs/*'] },
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
]
