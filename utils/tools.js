const os = require('os')
const { spawn } = require('child_process')
const download = require('download-git-repo')
const fs = require('fs')
const util = require('util')
const path = require('path')
const ejs = require('ejs')
const writeFileAsync = util.promisify(fs.writeFile)
const chalk = require('chalk')

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
      if (code != 0) {
        process.exit(1)
      }
      resolve(1)
    })
  })
}

exports.isWindows = isWindows
