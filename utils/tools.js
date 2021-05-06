const os = require('os')

const isWindows = () => {
  const osType = os.type()
  return osType === 'Windows_NT'
}

exports.isWindows = isWindows
