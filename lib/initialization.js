const inquirer = require("inquirer")
const path = require('path')
const writeFileUtil = require('../utils/writeFile')
const download = require('download-git-repo')
const ora = require('ora')
const chalk = require('chalk')
const fs = require('fs')
const { downloadDependencies, getTemplateMap, renderFile } = require('../utils/tools')

module.exports = async function () {
  const templateSpinner = ora(chalk.blue('正在获取数据中...'))
  templateSpinner.start()

  let tempaltesMap
  try {
    tempaltesMap = await getTemplateMap()
    templateSpinner.text = chalk.green('获取模板数据成功！')
    templateSpinner.succeed()
  } catch (err) {
    templateSpinner.text = chalk.red('获取模板数据失败！')
  }

  const templateNames = [...tempaltesMap.keys()]

  const { templateName } = await inquirer.prompt([
      {
        type: 'list',
        name: 'tempalteName',
        message: '请选择一个模板',
        choices: templateNames,
      }
  ])

  const { projectName, version } = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: '请为您的项目命名',
        validate: (name) => {
            const templateIsExist = fs.existsSync(name)
            if (!name) {
                return chalk.red('请输入项目名称')
            } else if (templateIsExist) {
                return chalk.red('当前目录下有同名项目')
            }
            return true
        }
      },
      {
        type: 'input',
        name: 'version',
        message: '项目版本',
        default: '1.0.0',
        validate: (version) => {
            const reg = /^([1-9]\d|[1-9])(.([1-9]\d|\d)){2}$/
            if (!version) {
                return chalk.red('请输入版本号')
            } else if (!reg.test(version)) {
                return chalk.red('请输入正确的版本号')
            }
            return true
        }
      }
  ])

  const { downloadUrl } = tempaltesMap.get(templateName)

  const spinner = ora(chalk.blue('模板正在下载中...'))
  const downloadSpinner = ora(chalk.blue('依赖安装中...'))
  spinner.start()

  download(downloadUrl, projectName, { clone: true }, async (err) => {
      if (err) {
          spinner.text = chalk.red('初始化模板失败！')
          spinner.fail()
          return false
      }
      const destDir = process.cwd()

      const paceageJson = path.join(`${destDir}/${projectName}`, 'package.json')
      const paceageJsonLog = await renderFile(paceageJson, { projectName, version })
      console.log(paceageJsonLog)

      spinner.text = chalk.green('初始化模板成功！')
      spinner.succeed()

      downloadSpinner.start()
      const downloadDest = path.join(destDir, projectName)
      downloadDependencies(templateName, downloadDest, tempaltesMap)
        .then(() => {
            downloadSpinner.text = chalk.green('安装完成！')
            downloadSpinner.succeed()
        })
  })
}
