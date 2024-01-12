#!/usr/bin/env node

// Check node version before requiring/doing anything else
// The user may be on a very old node version

const {
  chalk,
  semver
} = require('@ssmt/cli-shared-utils')
const requiredVersion = require('../package.json').engines.node
const leven = require('leven')

function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted, {
      includePrerelease: true
    })) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ))
    process.exit(1)
  }
}

checkNodeVersion(requiredVersion, '@ssmt/cli')

const fs = require('fs')
const path = require('path')
// const slash = require('slash')
const minimist = require('minimist')
const program = require('commander')

program
  .version(`@ssmt/cli ${require('../package').version}`)
  .usage('<command> [options]')

program
  .command('add <component-name>')
  .description('create a new component powered by ssmt-cli-service')
  .option('--force', 'Overwrite target directory if it exists')
  .option('-t, --table', 'create a new table component')
  .option('-f, --form', 'create a new form component')
  .option('--merge', 'Merge target directory if it exists')
  .action((name, options) => {
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the component\'s name, the rest are ignored.'))
    }
    require('../lib/add')(name, options)
  })

program.parse(process.argv)