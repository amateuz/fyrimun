/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-standard-vue/scss'
  ],
  plugins: ['stylelint-scss', 'stylelint-order'],
  rules: {
    'declaration-empty-line-before': null,
    'order/order': [
      'custom-properties',
      'dollar-variables',
      {
        type: 'at-rule',
        name: 'include'
      },
      'declarations',
      {
        type: 'rule',
        selector: '^&'
      },
      {
        type: 'at-rule',
        name: 'media'
      }
    ],
    'order/properties-order': [
      // Box Model
      {
        groupName: 'Box Model',
        emptyLineBefore: 'always',
        noEmptyLineBetween: true,
        properties: [
          'display',
          'flex',
          'flex-direction',
          'flex-flow',
          'justify-content',
          'align-items',
          'gap',
          'margin',
          'margin-block',
          'margin-inline',
          'margin-top',
          'margin-right',
          'margin-bottom',
          'margin-left',
          'padding',
          'padding-block',
          'padding-inline',
          'padding-top',
          'padding-right',
          'padding-bottom',
          'padding-left',
          'width',
          'height',
          'max-width',
          'max-height',
          'min-width',
          'min-height',
          'border',
          'border-width',
          'border-style',
          'border-color',
          'border-radius',
          'outline',
          'overflow',
          'overflow-x',
          'overflow-y',
          'visibility',
          'box-sizing'
        ]
      },

      // Positioning
      {
        groupName: 'Positioning',
        emptyLineBefore: 'always',
        noEmptyLineBetween: true,
        properties: [
          'position',
          'top',
          'right',
          'bottom',
          'left',
          'z-index',
          'float',
          'clear',
          'clip',
          'transform'
        ]
      },

      // Typography
      {
        groupName: 'Typography',
        emptyLineBefore: 'always',
        noEmptyLineBetween: true,
        properties: [
          'font',
          'font-family',
          'font-size',
          'font-weight',
          'font-style',
          'font-variant',
          'line-height',
          'letter-spacing',
          'text-align',
          'text-transform',
          'text-decoration',
          'text-indent',
          'white-space',
          'word-wrap',
          'word-break'
        ]
      },

      // Visual Styles (Colors, Backgrounds, Borders)
      {
        groupName: 'Styling',
        emptyLineBefore: 'always',
        noEmptyLineBetween: true,
        properties: [
          'background',
          'background-color',
          'background-image',
          'background-repeat',
          'background-position',
          'background-size',
          'border-collapse',
          'border-spacing',
          'box-shadow',
          'color',
          'cursor',
          'opacity',
          'filter'
        ]
      },

      // Transitions and Animations
      {
        groupName: 'Transitions and Animations',
        emptyLineBefore: 'always',
        noEmptyLineBetween: true,
        properties: [
          'transition',
          'transition-delay',
          'transition-duration',
          'transition-property',
          'transition-timing-function',
          'animation',
          'animation-delay',
          'animation-direction',
          'animation-duration',
          'animation-fill-mode',
          'animation-iteration-count',
          'animation-name',
          'animation-play-state',
          'animation-timing-function'
        ]
      }
    ]
  }
}
