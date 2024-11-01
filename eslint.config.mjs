import js from '@eslint/js' // For 'eslint:recommended'
import pluginVue from 'eslint-plugin-vue' // Vue plugin
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import vueSkipPrettierFormattingEsLintConfig from '@vue/eslint-config-prettier/skip-formatting'

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig(),
  vueSkipPrettierFormattingEsLintConfig,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module'
    }
  }
]
