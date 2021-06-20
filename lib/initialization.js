const inquirer = require("inquirer")
const path = require('path')
const writeFileUtil = require('../utils/writeFile')
const download = require('download-git-repo')
const ora = require('ora')
const chalk = require('chalk')
const { templatesMap } = require('../utils/constants')

module.exports = async function () {
  const templateNames = [...templatesMap.keys()]

  const { templateName } = await inquirer.prompt([
      {
          type: 'list',
          name: 'templateName',
          message: '请选择一个模板',
          choices: templateNames,
      }
  ])

  const { projectName, version } = await inquirer.prompt([
      {
          type: 'input',
          name: 'projectName',
          message: '请为您的项目命名',
          default: templateName,
      },
      {
          type: 'input',
          name: 'version',
          message: 'Project version?',
          default: '1.0.0'
      },
  ])
  const { downloadUrl } = templatesMap.get(templateName)

  const spinner = ora(chalk.blue('正在下载中...'))
  spinner.start()

  download(downloadUrl, projectName, { clone: true }, (err) => {
      if (err) {
          spinner.text = chalk.red('初始化模板失败！')
          spinner.fail()
          return
      }

      const destDir = process.cwd()
      const packageJson = path.join(`${destDir}/${projectName}`, 'package.json')
      writeFileUtil.writeJson(
          packageJson, 
          {
              name: projectName,
              version,
          }
      )
      spinner.text = chalk.green('初始化模板成功！')
      spinner.succeed()
  })
}
