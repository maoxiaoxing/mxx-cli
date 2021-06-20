module.exports = function (aName, args) {
  require('./' + aName)(...args)
}