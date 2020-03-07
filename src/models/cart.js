const { runQuery } = require('../config/db')
exports.GetUserCart = (idCart, idUser, includeItem) => {
  return new Promise((resolve, reject) => {
    if (idCart) {
      runQuery(`SELECT * FROM carts WHERE id=${idCart} AND idUser=${idUser} AND checkOut=0`, (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        return resolve(results[1][0])
      })
    } else {
      runQuery(`
      SELECT id,idItem,nameItem,totalItem,totalPrice FROM carts WHERE idUser=${idUser} AND checkOut=0;
      SELECT SUM(totalPrice) AS totalPrice From carts WHERE idUser=${idUser} AND checkOut=0
      `, (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        if (!(results[1].length > 0)) {
          return resolve(false)
        }
        const dataCart = {
          totalPrice: results[2][0].totalPrice,
          totalTypeItems: results[1].length
        }
        if (includeItem) {
          dataCart.itemInCart = results[1]
        }
        return resolve(dataCart)
      })
    }
  })
}

exports.AddItem = (idUser, dataItem) => {
  return new Promise((resolve, reject) => {
    const { idItem, nameItem, totalItem, totalPrice } = dataItem
    runQuery(`SELECT COUNT(*) AS total FROM carts WHERE idUser=${idUser} AND idItem=${idItem} AND checkOut=0`,
      (err, results, fields) => {
        if (err || results[1][0].total) {
          return reject(new Error(err || "Item Already Added, Check You Cart's for Update Or Delete Item"))
        }
        runQuery(`INSERT INTO carts(idUser,idItem,nameItem,totalItem,totalPrice) VALUES(${idUser},${idItem},'${nameItem}',${totalItem},${totalPrice})`,
          (err, results, fields) => {
            if (err) {
              console.log(err)
              return reject(new Error(err))
            }
            return resolve(true)
          })
      })
  })
}

exports.UpdateItemCart = (idCart, idUser, dataItem) => {
  return new Promise((resolve, reject) => {
    const { totalItem, totalPrice } = dataItem
    runQuery(`UPDATE carts SET totalItem=${totalItem},totalPrice=${totalPrice} WHERE id=${idCart} AND idUser=${idUser} AND checkOut=0`,
      (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        console.log(results[1].affectedRows)
        return resolve(results[1].affectedRows)
      })
  })
}

exports.RemoveItemCart = (idCart, idUser) => {
  return new Promise((resolve, reject) => {
    runQuery(`DELETE FROM carts WHERE id=${idCart} AND idUser=${idUser} AND checkOut=0`, (err, results, fields) => {
      if (err) {
        console.log(err)
        return reject(new Error(err))
      }
      console.log(results[1].affectedRows)
      return resolve(results[1].affectedRows)
    })
  })
}

exports.CheckOutItem = (idUser, price) => {
  return new Promise((resolve, reject) => {
    runQuery(` 
      SELECT items.id,items.name,items.quantity,carts.idItem,carts.totalItem FROM items INNER JOIN carts ON carts.idItem = items.id WHERE items.quantity < carts.totalItem AND carts.idUser=${idUser} AND carts.checkOut=0 ;
      SELECT idItem FROM carts WHERE idUser=${idUser} AND checkOut=0
`, (err, results, fields) => {
      if (!err) {
        if (!results[1][0]) {
          const itemId = results[2].map(v => v.idItem)
          runQuery(`
          UPDATE userProfile SET balance=balance-${parseFloat(price)} WHERE idUser = ${idUser};
          UPDATE items INNER JOIN carts ON items.id = carts.idItem SET items.quantity = items.quantity - carts.totalItem WHERE carts.idUser=${idUser} AND carts.checkOut=0;
          UPDATE carts SET checkOut=1 WHERE idUser=${idUser} AND checkOut=0;
          INSERT INTO transcations(idUser,listItem,totalPrice) VALUES(${idUser},'${itemId.join(',')}',${price})
          `, (err, results, fields) => {
            if (err) {
              console.log(err)
              return reject(new Error(err))
            } else {
              return resolve(results[4].affectedRows)
            }
          })
        } else {
          const errQuantityItme = results[1].map((v) => {
            return `${v.name} Only have ${v.quantity} But You want ${v.totalItem}`
          }).join(', ')
          reject(new Error(errQuantityItme))
        }
      } else {
        console.log(err)
        return reject(new Error(err))
      }
    })
  })
}
