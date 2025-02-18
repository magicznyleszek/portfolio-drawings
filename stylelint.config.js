/** @type {import('stylelint').Config} */
export default {
  extends: 'stylelint-config-standard',
  rules: {
    'no-duplicate-selectors': [true, { severity: 'warning' }],
    'block-no-empty': [true, { severity: 'warning' }],
    'font-family-name-quotes': ['always-unless-keyword', { severity: 'warning' }],
    'comment-empty-line-before': ['always', { severity: 'warning', except: ['first-nested'], ignore: ['after-comment'] }],
    'declaration-empty-line-before': ['never', { severity: 'warning' }],
  },
}
