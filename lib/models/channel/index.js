// channel/index.js
var channel = require('./channel.js')

module.exports = {
  start: channel.start,
  list: channel.list,
  getActiveUsers: channel.getActiveUsers,
  setActiveUsers: channel.setActiveUsers,
  updateUserList: channel.updateUserList
}
