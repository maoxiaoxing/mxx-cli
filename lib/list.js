const chalk = require('chalk')
const { getTemplateMap } = require('../utils/tools')
const ora = require('ora')

module.exports = async function () {
  const templateSpinner = ora(chalk.blue('正在获取模板数据...'))
  templateSpinner.start()

  let templatesMap
  try {
    templatesMap = await getTemplateMap()
    templateSpinner.text = chalk.green('获取模板数据成功！')
    templateSpinner.succeed()
  } catch (err) {
    templateSpinner.text = chalk.red('获取模板数据失败！')
  }

  for (const [templateName, tempalteInfo] of templatesMap.entries()) {
    const tempalteItem = chalk.black(`  ${templateName} --- ${tempalteInfo.description}`)
    console.log(tempalteItem)
  }
}
