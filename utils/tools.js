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
const { rejects } = require('assert')

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

/**
 * 将对象转换为 Map 数据结构
 * @param {对象} obj 
 * @returns 模板信息 Map
 */
const jsonToTemplateMap = (obj) => {
  const strMap = new Map()
  const prefix = 'https://github.com/'
  for (const k of Object.keys(obj)) {
    strMap.set(k, {
      ...obj[k],
      downloadUrl: `${prefix}maoxiaoxing/mxx-cli-templates#${k}`
    })
  }
  return strMap
}

/**
 * 获取模板信息
 */
const getTemplateMap = async () => {
  const destDir = process.cwd()
  await removeFile(`${destDir}/_template`)
  const url = 'https://github.com/maoxiaoxing/mxx-cli-templates#master'
  const readAsync = util.promisify(fs.readFile)
  return new Promise((resolve, reject) => {
    download(url, '_template', { clone: true }, async (err) => {
      if (err) {
        return reject(err)
      }
      const data = await readAsync(path.join(`${destDir}/_tempalte/template-config.json`))
      const resultString = data.toString()
      const resultJson = JSON.parse(resultString)
      const tempaltesMap = jsonToTemplateMap(resultJson)
      resolve(tempaltesMap)
      await removeFile(`${destDir}/_tempalte`)
    })
  })
}

/**
 * 渲染文件
 * @param {文件} file 
 * @param {模板内容} tempalteInfo 
 * @returns 
 */
const renderFile = (file, tempalteInfo) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(file, tempalteInfo, async (err, data) => {
      if (err) {
        return resolve(chalk.red(`${file}写入失败！`))
      }

      await writeFileAsync(file, data)
      resolve(chalk.green(`${file}写入成功！`))
    })
  })
}

exports.isWindows = isWindows
exports.removeFile = removeFile
exports.downloadDependencies = downloadDependencies
exports.getTemplateMap = getTemplateMap
exports.renderFile = renderFile
