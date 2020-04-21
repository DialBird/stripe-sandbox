const withCSS = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
require('dotenv').config()

module.exports = withCSS(withSass({
  env: {}
}))
