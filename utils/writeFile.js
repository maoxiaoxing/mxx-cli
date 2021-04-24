const util = require('util')
const fs = require('fs')
const readAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)

async function writeJson (file, params) {
  try {
    // 读文件
    let data = await readAsync(file)
    // 文件处理
    var resultString = data.toString(); 

    var resultJson = JSON.parse(resultString); 
    Object.keys(params).forEach(function(key) {
        resultJson[key] = params[key]
      }
    )
    // 写文件
    await writeFileAsync(file, JSON.stringify(resultJson))
  } catch (error) {
    return Promise.reject(error)
  }
}

exports.writeJson = writeJson
