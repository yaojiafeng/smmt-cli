const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const Addtor = require('./Addtor')
const {
  chalk,
  exit
} = require('@ssmt/cli-shared-utils')
const validateProjectName = require('validate-npm-package-name')

async function add(projectName, options) {
  if (!options.form && !options.table) {
    console.error(chalk.red.dim('Warning: ' + 'Invalid component options, you should use -t or --form to create a component'))
    exit(1)
  }
  const cwd = options.cwd || process.cwd()
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')


  const result = validateProjectName(name)
  if (!result.validForNewPackages) {
    if (!(result.warnings && result.warnings.length === 1 && result.warnings[0] === 'name can no longer contain capital letters')) {
      console.error(chalk.red(`Invalid component name: "${name}"`))
      result.errors && result.errors.forEach(err => {
        console.error(chalk.red.dim('Error: ' + err))
      })
      result.warnings && result.warnings.forEach(warn => {
        console.error(chalk.red.dim('Warning: ' + warn))
      })
      exit(1)
    }

  }

  if (fs.existsSync(targetDir) && !options.merge) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      if (inCurrent) {
        const {
          ok
        } = await inquirer.prompt([{
          name: 'ok',
          type: 'confirm',
          message: `Add component in current directory?`
        }])
        if (!ok) {
          return
        }
      } else {
        const {
          action
        } = await inquirer.prompt([{
          name: 'action',
          type: 'list',
          message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
          choices: [{
              name: 'Overwrite',
              value: 'overwrite'
            },
            {
              name: 'Merge',
              value: 'merge'
            },
            {
              name: 'Cancel',
              value: false
            }
          ]
        }])
        if (!action) {
          return
        } else if (action === 'overwrite') {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
          await fs.remove(targetDir)
        }
      }
    }
  }

  const creator = new Addtor(name, targetDir)
  await creator.add(options)
}

module.exports = (...args) => {
  return add(...args).catch(err => {
    if (!process.env.SSMT_CLI_TEST) {
      process.exit(1)
    }
  })
}