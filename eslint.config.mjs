import es5 from 'eslint-config-kswedberg/flat/es5.mjs';
import {browserGlobals} from 'eslint-config-kswedberg/flat/globals.mjs';

export default [
  {
    ignores: [
      'lib/**/*',
      'jquery.smooth-scroll.min.js'
    ]
  },
  ...es5,
  {
    name: 'browser',
    ...browserGlobals

  },
  {
    name: 'jQuery',
    languageOptions: {
      globals: {
        jQuery: 'readonly',
        $: 'readonly',
        require: 'readonly',
        define: 'readonly',
        module: 'readonly'
      }
    },
    rules: {
      'comma-dangle': ['warn', 'never'],
      '@stylistic/comma-dangle': ['warn', 'never']
    }
  }
];
