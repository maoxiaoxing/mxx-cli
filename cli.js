#!/usr/bin/env node

// Node CLI 应用入口文件必须要有这样的文件头
// 如果是 Linux 或者 macOS 系统下还需要修改文件的读写权限为775
// 具体就是通过 chmod 775 cli.js 实现修改

// 脚手架的工作过程：
// 1. 通过命令行交互询问用户问题
// 2. 根据用户回答的结果生成文件

const inquirer = require("inquirer")
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')
const program = require('commander')
const writeFileUtil = require('./utils/writeFile')
const download = require('download-git-repo')

const templatesMap = new Map([
    ['vue-ts', {
        url: 'https://github.com/maoxiaoxing/vue-ts-template',
        downloadUrl: 'github:maoxiaoxing/vue-ts-template#main',
        description: 'vue2 ts 项目模板',
    }],
    ['vue3', {
        url: 'https://github.com/maoxiaoxing/vue3-study',
        downloadUrl: 'github:maoxiaoxing/vue3-study#master',
        description: 'vue3 + vue-cli 练习项目',
    }],
    ['react', {
        url: '',
        downloadUrl: '',
        description: 'react',
    }],
])

program
    .version('1.0.0') // 输出版本号

program
    .command('list')
    .description('查看所有模板')
    .action(function() {
        console.log(`
            vue => vue模板
            react => react模板
        `)
    })

program
    .command('init')
    .description('初始化项目')
    .action(async () => {
        // console.log(templateName, projectName)
        const templateNames = [...templatesMap.keys()]
        console.log(templateNames)

        const { templateName } = await inquirer.prompt([
            {
                type: 'list',
                name: 'templateName',
                message: '请选择一个模板',
                choices: templateNames,
            }
        ])

        const { projectName } = await inquirer.prompt([
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
            {
                type: 'input',
                name: 'description',
                message: 'Project description?',
                default: ''
            },
        ])
        const { downloadUrl } = templatesMap.get(templateName)

        download(downloadUrl, projectName, { clone: true }, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log('下载成功')
            }
        })
    })

program.parse(process.argv)

