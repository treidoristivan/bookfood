const mysql = require('mysql')
require('dotenv').config()

/* Create Connection to Database */
const db = mysql.createConnection({
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  /* To Run Multiple  Query */
  multipleStatements: true  
})
db.connect()

/* To use DB_NAME on .env Before RUN db.query() */
const runQuery = (query, callBack) => {
  query = `use ${process.env.DB_NAME};` + query
  return db.query(query, callBack)
}

module.exports = { db, runQuery }
