const { runQuery } = require('../config/db')

exports.GetRestaurants = (id, params) => {
  return new Promise((resolve, reject) => {
    if (id) {
      runQuery(`SELECT * FROM restaurants WHERE id=${id}`, (err, results, fields) => {
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
        SELECT COUNT(*) AS total from restaurants ${condition.substring(0, condition.indexOf('LIMIT'))};
        SELECT * from restaurants ${condition}
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

exports.RegisterRestaurant = (data) => {
  return new Promise((resolve, reject) => {
    let columns = []
    let values = []
    Object.keys(data).forEach((v) => {
      if (v && ['id_owner', 'name', 'logo', 'location', 'decription'].includes(v) && data[v]) {
        columns.push(v)
        values.push(data[v])
      }
    })
    runQuery(`SELECT COUNT(*) AS total FROM users WHERE id=${data.id_owner}`, (err, results, fields) => {
      if (err || !results[1][0].total) {
        return resolve(err || 'Owner id Not Registered')
      }
      runQuery(`
      INSERT INTO restaurants(${columns.map(v => v).join(',')}) VALUES(${values.map(v => `'${v}'`).join(',')});
      UPDATE users SET is_admin = 1 WHERE id=${data.id_owner}
    `, (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        console.log(results[1])
        return resolve(results[1].insertId)
      })
    })
  })
}

exports.UpdateRestaurant = (id, params) => {
  return new Promise((resolve, reject) => {
    runQuery(`UPDATE restaurants SET ${params.map(v => `${v.key} = '${v.value}'`).join(',')} WHERE id=${id}`, (err, results, fields) => {
      if (err) {
        console.log(err)
        return reject(new Error(err))
      }
      console.log(results[1])
      return resolve(true)
    })
  })
}

exports.DeleteRestaurant = (id) => {
  return new Promise((resolve, reject) => {
    runQuery(`DELETE FROM restaurants WHERE id=${id}`, (err, results, fields) => {
      if (err) {
        console.log(err)
        return reject(new Error(err))
      }
      return resolve(true)
    })
  })
}
