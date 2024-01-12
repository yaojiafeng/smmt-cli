[
  'env',
  'exit',
  'logger',
  'spinner',
  'request'
].forEach(m => {
  Object.assign(exports, require(`./lib/${m}`))
})

exports.chalk = require('chalk')
exports.commander = require('commander')
exports.execa = require('execa')
exports.semver = require('semver')

