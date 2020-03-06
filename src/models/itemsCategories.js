const { runQuery } = require('../config/db')

exports.GetCategories = (id, params) => {
  return new Promise((resolve, reject) => {
    if (id) {
      runQuery(`SELECT * FROM itemCategories WHERE id=${id}`, (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        return resolve(results[1][0])
      })
    } else {
      runQuery('SELECT * from itemCategories', (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        return resolve(results[1])
      })
    }
  })
}

exports.CreateCategories = (name) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT COUNT(*) as total FROM itemCategories WHERE name='${name}'`, (err, results, fields) => {
      if (err || results[1][0].total) {
        return reject(new Error(err || 'Categories Already Exists'))
      }
      runQuery(`INSERT INTO itemCategories(name) VALUES('${name}')`, (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        console.log(results[1])
        return resolve(results[1].insertId)
      })
    })
  })
}

exports.UpdateCategories = (id, name) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT COUNT(*) as total FROM itemCategories WHERE name='${name}'`, (err, results, fields) => {
      if (err || results[1][0].total) {
        return reject(new Error(err || 'Categories Already Exists'))
      }
      runQuery(`UPDATE itemCategories SET name = '${name}' WHERE id=${id}`, (err, results, fields) => {
        if (err) {
          console.log(err)
          return reject(new Error(err))
        }
        console.log(results[1])
        return resolve(true)
      })
    })
  })
}

exports.DeleteCategories = (id) => {
  return new Promise((resolve, reject) => {
    runQuery(`DELETE FROM itemCategories WHERE id=${id}`, (err, results, fields) => {
      if (err) {
        console.log(err)
        return reject(new Error(err))
      }
      return resolve(true)
    })
  })
}
