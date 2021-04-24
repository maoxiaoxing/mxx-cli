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
    .command('init <template> <project>')
    .description('init template')
    .action(function(templateName, projectName) {
        // console.log(templateName, projectName)
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

