const baseConfig = require('expo-module-scripts/eslint.config.base');

module.exports = [
  ...baseConfig,
  {
    ignores: ['build/**', 'node_modules/**'],
  },
];