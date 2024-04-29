/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    '@csstools/postcss-global-data': {
      files: ['frontend/css/mq.css'],
    },
    'postcss-custom-media': {},
  },
}
