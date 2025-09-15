module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-prettier'
  ],
  rules: {
    // RTL-specific rules
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
    
    // Arabic/RTL font rules
    'font-family-name-quotes': 'always-where-recommended',
    'font-weight-notation': 'numeric',
    
    // Bootstrap compatibility
    'selector-class-pattern': null,
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen'
        ]
      }
    ],
    
    // RTL logical properties
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          'composes',
          'margin-inline-start',
          'margin-inline-end',
          'padding-inline-start',
          'padding-inline-end',
          'border-inline-start',
          'border-inline-end',
          'inset-inline-start',
          'inset-inline-end'
        ]
      }
    ],
    
    // Color and contrast rules for accessibility
    'color-hex-case': 'lower',
    'color-hex-length': 'short',
    'color-named': 'never',
    'color-no-invalid-hex': true,
    
    // Spacing and layout rules
    'length-zero-no-unit': true,
    'number-leading-zero': 'always',
    'number-no-trailing-zeros': true,
    
    // RTL-specific spacing
    'declaration-block-semicolon-newline-after': 'always',
    'declaration-colon-space-after': 'always',
    'declaration-colon-space-before': 'never',
    
    // Selector rules
    'selector-max-id': 1,
    'selector-max-universal': 1,
    'selector-max-type': 3,
    
    // Custom property rules
    'custom-property-pattern': '^[a-z][a-zA-Z0-9-]*$',
    
    // Comment rules
    'comment-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['stylelint-commands']
      }
    ]
  },
  ignoreFiles: [
    'node_modules/**/*',
    'public/assets/**/*',
    'dist/**/*',
    'vendor/**/*'
  ]
};
