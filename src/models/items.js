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
      const { perPage, currentPage, search, sort } = params
      const condition = `
          ${search && `WHERE ${search.map(v => `${v.key} LIKE '%${v.value}%'`).join(' AND ')}`}
          ORDER BY ${sort.map(v => `${v.key} ${!v.value ? 'ASC' : 'DESC'}`).join(' , ')}
          ${(parseInt(currentPage) && parseInt(perPage)) ? `LIMIT ${parseInt(perPage)} 
          OFFSET ${(parseInt(currentPage) - 1) * parseInt(perPage)}` : ''}
         `
      runQuery(`
        SELECT COUNT(*) AS total from items ${condition.substring(0, condition.indexOf('LIMIT'))};
        SELECT * from items ${condition}
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
    runQuery(`UPDATE items SET ${params.map(v => `${v.key} = '${v.value}'`).join(',')} WHERE id=${id}`, (err, results, fields) => {
      if (err) {
        console.log(err)
        return reject(new Error(err))
      }
      console.log(results[1])
      return resolve(results[1].affcectedRows)
    })
  })
}

exports.DeleteItems = (id) => {
  return new Promise((resolve, reject) => {
    runQuery(`DELETE FROM items WHERE id=${id}`, (err, results, fields) => {
      if (err) {
        console.log(err)
        return reject(new Error(err))
      }
      console.log(results[1])
      return resolve(results[1].affcectedRows)
    })
  })
}
