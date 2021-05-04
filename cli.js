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
const ora = require('ora')

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
            {
                type: 'input',
                name: 'description',
                message: 'Project description?',
                default: ''
            },
        ])
        const { downloadUrl } = templatesMap.get(templateName)

        const spinner = ora('正在下载中...')
        spinner.start()

        download(downloadUrl, projectName, { clone: true }, (err) => {
            if (err) {
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
            spinner.text = '初始化模板成功！'
            spinner.succeed()
        })
        
        return

        inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Project name?',
                default: projectName
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
        .then(async (answers) => {
            console.log(answers)
            // 根据用户回答的结果生成文件

            const { downloadUrl } = templatesMap.get(templateName)
            console.log(downloadUrl)
            


            return
            const tempHash = {
                vue: 'templates/vue',
                react: 'templates/react',
            }
            let tempPath
            try {
                tempPath = tempHash[templateName]
                if (!tempPath) {
                    throw new Error(`没有【 ${templateName} 】这个模板`)
                }
            }
            catch(err) {
                console.log(err)
                process.exit() // 如果报错 终止进程
            }

            // 模板目录
            const tmplDir = path.join(__dirname, tempPath)            

            // 目标目录
            const destDir = process.cwd()

            // 将模板下的文件全部转换到目标目录
            fs.readdir(tmplDir, (err, files) => {
                if (err) throw err
                files.forEach((file) => {
                    console.log(file)
                    // 通过模板引擎来渲染文件
                    ejs.renderFile(path.join(tmplDir, file), answers, (err, res) => {
                        if (err) throw err

                        fs.writeFileSync(path.join(destDir, file), res)
                        const packageJson = path.join(destDir, 'package.json')
                        writeFileUtil.writeJson(
                            packageJson, 
                            {
                                name: answers.name,
                                version: answers.version
                            }
                        )                    
                    })
                })
            })
        })

    })

program.parse(process.argv)

