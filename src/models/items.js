const { runQuery } = require('../config/db')

exports.GetItems = (id, params) => {
  return new Promise((resolve, reject) => {
    if (id) {
      runQuery(`SELECT * FROM items WHERE id=${id}`, (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        return resolve(results[1][0])
      })
    } else {
      runQuery('SELECT * FROM items', (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        return resolve(results[1])
      })
    }
  })
}

exports.CreateItems = (data) => {
  return new Promise((resolve, reject) => {
    runQuery(`INSERT INTO items(${data.columns.map(v => v).join(',')}) VALUES(${data.values.map(v => `'${v}'`).join(',')})
    `, (err, results, fields) => {
      if (err) {
        return reject(new Error(err))
      }
      console.log(results[1])
      return resolve(results[1].insertId)
    })
  })
}
exports.UpdateItems = (id, params) => {
  return new Promise((resolve, reject) => {
    runQuery(`UPDATE items SET ${params.map(v => `${v.key} = '${v.value}'`).join(',')} WHERE _id = ${id}`, (err, results, fields) => {
      if (err) {
        console.log(err)
        return reject(new Error(err))
      }
      console.log(results[1])
      return resolve(true)
    })
  })
}

exports.DeleteItems = (id) => {
  return new Promise((resolve, reject) => {
    runQuery(`DELETE FROM items WHERE _id=${id}`, (err, results, fields) => {
      if (err) {
        console.log(err)
        return reject(new Error(err))
      }
      console.log(results[1])
      return resolve(true)
    })
  })
}
