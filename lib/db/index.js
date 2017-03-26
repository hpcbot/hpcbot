// db/index.js
var db = require('./db')

module.exports = {  
  connect: db.connect,
  get: db.get
}