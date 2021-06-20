#!/usr/bin/env node

// Node CLI 应用入口文件必须要有这样的文件头
// 如果是 Linux 或者 macOS 系统下还需要修改文件的读写权限为775
// 具体就是通过 chmod 775 cli.js 实现修改

// 脚手架的工作过程：
// 1. 通过命令行交互询问用户问题
// 2. 根据用户回答的结果生成文件

const path = require('path')
const program = require('commander')
const download = require('download-git-repo')
const fs = require('fs')
const { actionMap } = require('./utils/constants')
const actionFn = require('./lib/index')


const pjsonPath = path.join(__dirname, 'package.json')
const pjson = JSON.parse(fs.readFileSync(pjsonPath, 'utf-8'))

program
    .version(pjson.version, '-v, --version') // 输出版本号

for (const [aName, aConfig] of actionMap.entries()) {
    program
        .command(aName)
        .alias(aConfig.alias)
        .description(aConfig.description)
        .action(function() {
            actionFn(aName, process.argv.slice(3))
        })
}


program.parse(process.argv)

