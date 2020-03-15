const { runQuery } = require('../config/db')

exports.GetReview = (id, idUser, params) => {
  return new Promise((resolve, reject) => {
    if (id) {
      runQuery(`SELECT * FROM itemReviews WHERE _id =${id} ${idUser ? `AND id_user =${parseInt(idUser)}` : ''}`, (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        if (!(results[1].length > 0)) {
          return resolve(false)
        }
        return resolve(results[1][0])
      })
    } else {
      const { perPage, currentPage, search, sort } = params
      const condition = `
          ${idUser ? `WHERE id_user = ${idUser}` : ''}
          ${search && `${idUser ? 'AND' : 'WHERE'} ${search.map(v => `${v.key} LIKE '%${v.value}%'`).join(' AND ')}`}
          ORDER BY ${sort.map(v => `${v.key} ${!v.value ? 'ASC' : 'DESC'}`).join(' , ')}
          ${(parseInt(currentPage) && parseInt(perPage)) ? `LIMIT ${parseInt(perPage)} 
          OFFSET ${(parseInt(currentPage) - 1) * parseInt(perPage)}` : ''}
         `
      console.log(condition)
      runQuery(`
        SELECT COUNT(*) AS total from itemReviews ${condition.substring(0, condition.indexOf('LIMIT'))};
        SELECT * from itemReviews ${condition}
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
exports.GetReviewItem = (idItem, params) => {
  return new Promise((resolve, reject) => {
    const { perPage, currentPage, search, sort } = params
    const condition = `
        ${idItem ? `WHERE IR.id_item = ${idItem}` : ''}
        ${search && `${idItem ? 'AND' : 'WHERE'} ${search.map(v => `IR.${v.key} LIKE '%${v.value}%'`).join(' AND ')}`}
        ORDER BY ${sort.map(v => `IR.${v.key} ${!v.value ? 'ASC' : 'DESC'}`).join(' , ')}
        ${(parseInt(currentPage) && parseInt(perPage)) ? `LIMIT ${parseInt(perPage)} 
        OFFSET ${(parseInt(currentPage) - 1) * parseInt(perPage)}` : ''}
        `
    runQuery(`
      SELECT COUNT(*) AS total from itemReviews IR ${condition.substring(0, condition.indexOf('LIMIT'))};
      SELECT IR._id, IR.id_item,U.username,UP.picture, IR.review, IR.review, IR.rating,IR.created_at from itemReviews IR INNER JOIN users U ON IR.id_user= U._id INNER JOIN userProfile UP ON IR.id_user=UP.id_User ${condition}
    `, (err, results, fields) => {
      if (err) {
        return reject(new Error(err))
      }
      if (results[1][0]) {
        const { total } = results[1][0]
        console.log(results[2])
        return resolve({ results: results[2], total })
      } else {
        return resolve({ results: [], total: 0 })
      }
    })
  })
}
exports.CreateReview = (idUser, params) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT COUNT(*) as total FROM itemReviews WHERE id_user=${idUser} AND id_item=${params.id_item}`, (err, results, fields) => {
      if (err || results[1][0].total) {
        return reject(new Error(err || 'Already Review this item You Can Update or Delete this review'))
      }
      runQuery(`INSERT INTO itemReviews(id_item,id_user,rating,review) VALUES(${params.id_item},${idUser}, ${params.rating},'${params.review}')`, (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        console.log(results[1])
        return resolve(results[1].insertId)
      })
    })
  })
}

exports.UpdateReview = (id, params) => {
  return new Promise((resolve, reject) => {
    runQuery(`UPDATE itemReviews SET ${params.map(v => `${v.key} = '${v.value}'`).join(' , ')} WHERE _id=${id}`, (err, results, fields) => {
      if (err) {
        console.log(err)
        return reject(new Error(err))
      }
      console.log(results[1])
      return resolve(results[1].affectedRows)
    })
  })
}

exports.DeleteReview = (id) => {
  return new Promise((resolve, reject) => {
    runQuery(`DELETE FROM itemReviews WHERE _id=${id}`, (err, results, fields) => {
      if (err) {
        console.log(err)
        return reject(new Error(err))
      }
      console.log(results[1])
      return resolve(results[1].affectedRows)
    })
  })
}
