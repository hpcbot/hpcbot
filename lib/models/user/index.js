// user/index.js
var user = require('./user.js')

module.exports = {
  start: user.start,
  getHouse: user.getHouse,
  setHouse: user.setHouse,
  exists: user.exists,
  create: user.create
}