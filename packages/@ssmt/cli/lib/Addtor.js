const path = require('path')
const fs = require('fs-extra')
const writeFileTree = require('./util/writeFileTree')
const EventEmitter = require('events')

const {
  log,
  chalk,
  execa
} = require('@ssmt/cli-shared-utils')
module.exports = class Addtor extends EventEmitter {
  constructor(name, context) {
    super()

    this.name = name
    this.context = process.env.SSMT_CLI_CONTEXT = context
    this.injectedPrompts = []
    this.promptCompleteCbs = []
    this.afterInvokeCbs = []
    this.afterAnyInvokeCbs = []
    this.run = this.run.bind(this)
  }

  async add(cliOptions = {}, preset = null) {
    const {
      run,
      name,
      context,
    } = this

    if (cliOptions.form) {

      log(`✨  add component  in ${chalk.yellow(context)}.`)
      // create vue file
      log('📄  Generating index.vue...')
      var vueFileStr = fs.readFileSync(path.join(__dirname, `/template/form/index.vue`), "utf-8");
      await writeFileTree(context, {
        'index.vue': vueFileStr.replace('@@@', name)
      })
      // create json file
      log('📄  Generating index.json...')
      var jsonStr = fs.readFileSync(path.join(__dirname, `/template/form/index.json`), "utf-8");
      await writeFileTree(context, {
        'index.json': jsonStr.replace('@@@', name)
      })
      log(`🎉  Successfully add component ${chalk.yellow(name)}.`)
    }

    if (cliOptions.table) {
      log(`✨  add component  in ${chalk.yellow(context)}.`)
      // create vue file
      log('📄  Generating index.vue...')
      var vueFileStr = fs.readFileSync(path.join(__dirname, `/template/table/index.vue`), "utf-8");
      await writeFileTree(context, {
        'index.vue': vueFileStr.replace('@@@', name)
      })
      // create json file
      log('📄  Generating index.json...')
      var jsonStr = fs.readFileSync(path.join(__dirname, `/template/table/index.json`), "utf-8");
      await writeFileTree(context, {
        'index.json': jsonStr.replace('@@@', name)
      })
      log(`🎉  Successfully add component ${chalk.yellow(name)}.`)
    }
  }

  run(command, args) {
    if (!args) {
      [command, ...args] = command.split(/\s+/)
    }
    return execa(command, args, {
      cwd: this.context
    })
  }
}