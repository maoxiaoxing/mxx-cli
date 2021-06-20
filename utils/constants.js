
const tools = require('./tools')

const prefix = tools.isWindows() ? 'github' : 'https://github.com'


const templatesMap = new Map([
  ['vue-ts', {
      url: 'https://github.com/maoxiaoxing/vue-ts-template',
      downloadUrl: `${prefix}:maoxiaoxing/vue-ts-template#main`,
      description: 'vue2 ts 项目模板',
  }],
  ['vue3', {
      url: 'https://github.com/maoxiaoxing/vue3-study',
      downloadUrl: `${prefix}:maoxiaoxing/vue3-study#master`,
      description: 'vue3 + vue-cli 练习项目',
  }],
  ['react', {
      url: '',
      downloadUrl: '',
      description: 'react',
  }],
])

const actionMap = new Map([
  ['list', {
      alias: 'ls',
      description: '查看所有模板',
      examples: ['mxxcli ls'],
  }],
  ['initialization', {
      alias: 'init',
      description: '初始化项目',
      examples: ['mxxcli init'],
  }],
])

exports.templatesMap = templatesMap
exports.actionMap = actionMap
