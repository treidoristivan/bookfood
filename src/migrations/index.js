const { db } = require('../config/db')
require('dotenv').config()

const tomigrate = require('./migrate.js')

const dbName = process.env.DB_NAME

db.query(`
CREATE DATABASE IF NOT EXISTS ${dbName};
use ${dbName};
${tomigrate.map(v => `${v}`).join(';')}
`, (err, results, field) => {
  if (err) {
    console.log(err)
  } else {
    console.log('Migrate Succes')
  }
})

db.end()
