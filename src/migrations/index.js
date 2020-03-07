const { db } = require('../config/db')
require('dotenv').config()

/* Get ARRAY OF QUERY TABLES */
const { table, foreign } = require('./migrate.js')

/* Get DB_NAME in .env */
const dbName = process.env.DB_NAME

/* RUN Query To Create Database and Tables */
db.query(`
 CREATE DATABASE IF NOT EXISTS ${dbName};
 use ${dbName};
 ${table.map(v => `${v}`).join(';')}`, (err, results, field) => {
  if (err) {
    console.log(err)
  } else {
    console.log('>>>>> Running Migrate ======>>>')
    db.query(`
    use ${dbName};
    ${foreign.map(v => `${v}`).join(';')}`, (err, results, field) => {
      if (err) {
        console.log(err)
      } else {
        console.log('>>>>> Migrate Succes')
      }
    })
    db.end()
  }
})
