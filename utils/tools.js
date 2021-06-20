const os = require('os')

// 判断是否是 Windows 系统
const isWindows = () => {
  const osType = os.type()
  return osType === 'Windows_NT'
}

exports.isWindows = isWindows
