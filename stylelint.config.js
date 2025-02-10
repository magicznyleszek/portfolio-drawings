/** @type {import('stylelint').Config} */
export default {
  extends: 'stylelint-config-standard',
  rules: {
    'no-duplicate-selectors': [true, { severity: 'warning' }],
    'block-no-empty': [true, { severity: 'warning' }],
  },
}
