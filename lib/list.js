const chalk = require('chalk')
const { templatesMap } = require('../utils/constants')

module.exports = function () {
  for(const [templateName, templateInfo] of templatesMap.entries()) {
    const templateItem = chalk.white(`  ${templateName} --- ${templateInfo.description}`)
    console.log(templateItem)
  }
}
