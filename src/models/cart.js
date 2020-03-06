const { runQuery } = require('../config/db')
exports.GetCart = (idUsers) => {
  return new Promise((resolve, reject) => {
    runQuery(` SELECT id,id_item,name_item,totalItems FROM cart WHERE id_user=${idUsers} && checkOut=0`, (err, results, fields) => {
      if (err) {
        return reject(new Error(err))
      }
      return resolve(results[1])
    })
  })
}
exports.AddItems = (idUsers, dataItems) => {
  return new Promise((resolve, reject) => {
    const { idItems, nameItems, totalItems, totalPrice } = dataItems
    runQuery(`SELECT COUNT(*) AS total FROM cart WHERE id_user=${idUsers} && id_item=${idItems}`, (err, results, fields) => {
      if (err) {
        return reject(new Error(err))
      }
      if (!(results[1][0])) {
        runQuery(`INSERT INTO cart(id_user,id_item,name_item,total_items,total_price) VALUES(${idUsers},${nameItems},${totalItems},${totalPrice})`, (err, results, fields) => {
          if (err) {
            console.log(err)
            return reject(new Error(err))
          }
          return resolve(true)
        })
      }
      reject(new Error('Items Success Added !'))
    })
  })
}
