const { runQuery } = require('../config/db')

exports.GetItem = (id, params) => {
  return new Promise((resolve, reject) => {
    if (id) {
      runQuery(`SELECT I._id,I.id_restaurant,R.name as name_restoran,I.id_category,IC.name as name_category,I.name,I.price,I.quantity,I.description,I.images,I.created_at,I.updated_at from items I JOIN restaurants R ON I.id_restaurant=R._id JOIN itemCategories IC ON I.id_category=IC._id WHERE I._id =${id}`, (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        return resolve(results[1][0])
      })
    } else {
      const { perPage, currentPage, search, sort } = params
      console.log(params)
      const condition = `
          ${params.id_restaurant ? `WHERE I.id_restaurant IN (${params.id_restaurant.join(',')})` : ''}
          ${params.id_category ? `WHERE I.id_category IN (${params.id_category.join(',')})` : ''}
          ${search && search[0] && `${params.id_category || params.id_restaurant ? 'AND' : 'WHERE'} ${search.map(v => `I.${v.key} LIKE '%${v.value}%'`).join(' AND ')}`}
          ORDER BY ${sort.map(v => `I.${v.key} ${!v.value ? 'ASC' : 'DESC'}`).join(' , ')}
          ${(parseInt(currentPage) && parseInt(perPage)) ? `LIMIT ${parseInt(perPage)} 
          OFFSET ${(parseInt(currentPage) - 1) * parseInt(perPage)}` : ''}
         `
      runQuery(`
        SELECT COUNT(*) AS total from items I ${condition.substring(0, condition.indexOf('LIMIT'))};
        SELECT I._id,I.id_restaurant,R.name as name_restaurant,I.id_category,IC.name as name_category,I.name,I.price,I.quantity,I.description,I.images,I.created_at,I.updated_at from items I JOIN restaurants R ON I.id_restaurant=R._id JOIN itemCategories IC ON I.id_category=IC._id  ${condition}
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

exports.CreateItem = (data) => {
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

exports.UpdateItem = (id, params) => {
  return new Promise((resolve, reject) => {
    runQuery(`UPDATE items SET ${params.map(v => `${v.key} = '${v.value}'`).join(',')} WHERE _id = ${id}`, (err, results, fields) => {
      if (err) {
        console.log(err)
        return reject(new Error(err))
      }
      console.log(results[1])
      return resolve(results[1].affectedRows)
    })
  })
}

exports.DeleteItem = (id) => {
  return new Promise((resolve, reject) => {
    runQuery(`DELETE FROM items WHERE _id=${id}`, (err, results, fields) => {
      if (err) {
        console.log(err)
        return reject(new Error(err))
      }
      console.log(results[1])
      return resolve(results[1].affectedRows)
    })
  })
}
