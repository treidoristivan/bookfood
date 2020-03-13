const { runQuery } = require('../config/db')

exports.GetCategory = (id, params) => {
  return new Promise((resolve, reject) => {
    if (id) {
      runQuery(`SELECT * FROM itemCategories WHERE _id =${id}`, (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        return resolve(results[1][0])
      })
    } else {
      const { perPage, currentPage, search, sort } = params
      const condition = `
          ${search && `WHERE ${search.map(v => `${v.key} LIKE '%${v.value}%'`).join(' AND ')}`}
          ORDER BY ${sort.map(v => `${v.key} ${!v.value ? 'ASC' : 'DESC'}`).join(' , ')}
          ${(parseInt(currentPage) && parseInt(perPage)) ? `LIMIT ${parseInt(perPage)} 
          OFFSET ${(parseInt(currentPage) - 1) * parseInt(perPage)}` : ''}
         `
      runQuery(`
        SELECT COUNT(*) AS total from itemCategories ${condition.substring(0, condition.indexOf('LIMIT'))};
        SELECT * from itemCategories ${condition}
      `, (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        if (results[1][0]) {
          const { total } = results[1][0]
          return resolve({ results: results[2], total })
        } else {
          return resolve({ results: [], total: 0 })
        }
      })
    }
  })
}
exports.GetIdCategory = (nameCategory) => {
  return new Promise((resolve, reject) => {
    runQuery(`
        SELECT _id from itemCategories WHERE name LIKE '%${nameCategory}%'
      `, (err, results, fields) => {
      if (err) {
        console.log(err)
        return reject(new Error(err))
      }
      if (results[1][0]) {
        const idCategory = results[1].map(v => v._id)
        return resolve(idCategory)
      } else {
        return resolve(false)
      }
    })
  })
}
exports.CreateCategory = (name) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT COUNT(*) as total FROM itemCategories WHERE name='${name}'`, (err, results, fields) => {
      if (err || results[1][0].total) {
        return reject(new Error(err || 'Category Already Exists'))
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

exports.UpdateCategory = (id, name) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT COUNT(*) as total FROM itemCategories WHERE name='${name}'`, (err, results, fields) => {
      if (err || results[1][0].total) {
        return reject(new Error(err || 'Category Already Exists'))
      }
      runQuery(`UPDATE itemCategories SET name = '${name}' WHERE _id = ${id}`, (err, results, fields) => {
        if (err) {
          console.log(err)
          return reject(new Error(err))
        }
        console.log(results[1])
        return resolve(results[1].affectedRows)
      })
    })
  })
}

exports.DeleteCategory = (id) => {
  return new Promise((resolve, reject) => {
    runQuery(`DELETE FROM itemCategories WHERE _id=${id}`, (err, results, fields) => {
      if (err) {
        console.log(err)
        return reject(new Error(err))
      }
      return resolve(results[1].affectedRows)
    })
  })
}
