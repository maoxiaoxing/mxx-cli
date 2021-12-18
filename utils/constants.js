
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
    }]
])

exports.actionMap = actionMap
