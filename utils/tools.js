const os = require('os')
const { spawn } = require('child_process')
const download = require('download-git-repo')
const fs = require('fs')
const util = require('util')
const path = require('path')
const ejs = require('ejs')
const writeFileAsync = util.promisify(fs.writeFile)
const chalk = require('chalk')
const { resolve } = require('path')

// 判断是否是 Windows 系统
const isWindows = () => {
  const osType = os.type()
  return osType === 'Windows_NT'
}

/**
 * 删除文件 进程
 * @param {文件路径} file 
 * @returns 
 */
const removeFile = (file) => {
  return new Promise((resolve, reject) => {
    const cmd = spawn('rm', ['-rf', file])
    cmd.on('close', (code) => {
      if (code !== 0) {
        process.exit(1)
      }
      resolve(1)
    })
  })
}

/**
 * 下载模板依赖
 * @param {模板名称} templateName 
 * @param {依赖路径} dest 
 * @param {模板信息} templatesMap 
 * @returns 
 */
const downloadDependencies = (templateName, dest, templatesMap) => {
  const templateConfig = templatesMap.get(templateName)
  const registry = templateConfig && templateConfig.registry || ''
  return new Promise((resolve, reject) => {
    const cmd = spawn(
      'npm', ['install', registry],
      {
        stdio: 'inherit',
        cwd: dest,
      }
    )
    cmd.on('close', (code) => {
      if (code !== 0) {
        process.exit(1)
      }
      resolve(1)
    })
  })
}

exports.isWindows = isWindows
exports.removeFile = removeFile
