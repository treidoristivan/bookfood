const Migration = require('express').Router()

Migration.get('/users', (req, res) => {
  require('../migrations/users')
  res.send('OK')
})

module.exports = { Migration }
