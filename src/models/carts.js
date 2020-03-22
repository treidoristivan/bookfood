const { runQuery } = require('../config/db')
exports.GetUserCart = (idCart, idUser, includeItem) => {
  return new Promise((resolve, reject) => {
    if (idCart) {
      runQuery(`SELECT C._id,C.id_item,C.name_item,I.images,C.total_items,C.total_price FROM carts C INNER JOIN items I ON C.id_item=I._id WHERE C._id=${idCart} && C.id_user=${idUser} AND C.is_check_out=0`, (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        return resolve(results[1][0])
      })
    } else {
      runQuery(`
      SELECT C._id,C.id_item,C.name_item,I.images,C.total_items,C.total_price FROM carts C INNER JOIN items I ON C.id_item=I._id WHERE C.id_user=${idUser} AND C.is_check_out=0;
      SELECT SUM(total_price) AS totalPrice From carts WHERE id_user=${idUser} AND is_check_out=0
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
    const { idItem, nameItem, imagesItem, totalItem, totalPrice } = dataItem
    runQuery(`SELECT COUNT(_id) AS total, _id FROM carts WHERE id_user=${idUser} AND id_item=${idItem} AND is_check_out=0`,
      (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        const dataCart = results[1][0]
        if (dataCart.total) {
          return runQuery(`UPDATE carts SET total_items=total_items+${totalItem},total_price=total_price+${totalPrice} WHERE id_item=${idItem} AND id_user=${idUser} AND is_check_out=0`,
            (err, results, fields) => {
              if (err) {
                return reject(new Error(err))
              }
              console.log('datupdate', results[1])
              return resolve({ status: 'update', idCart: dataCart._id })
            })
        }
        runQuery(`INSERT INTO carts(id_user,id_item,name_item,images_item,total_items,total_price) VALUES(${idUser},${idItem},'${nameItem}','${imagesItem}',${totalItem},${totalPrice})`,
          (err, results, fields) => {
            if (err) {
              console.log(err)
              return reject(new Error(err))
            }
            console.log(results[1])
            return resolve({ status: 'created', idCart: results[1].insertedId })
          })
      })
  })
}

exports.UpdateItemCart = (idCart, idUser, dataItem) => {
  return new Promise((resolve, reject) => {
    const { totalItem, totalPrice } = dataItem
    runQuery(`UPDATE carts SET total_items=${totalItem},total_price=${totalPrice} WHERE _id=${idCart} AND id_user=${idUser} AND is_check_out=0`,
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
    runQuery(`DELETE FROM carts WHERE _id=${idCart} AND id_user=${idUser} AND is_check_out=0`, (err, results, fields) => {
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
      SELECT items._id,items.name,items.quantity,carts.id_item,carts.total_items FROM items INNER JOIN carts ON carts.id_item = items._id WHERE items.quantity < carts.total_items AND carts.id_user=${idUser} AND carts.is_check_out=0 ;
      SELECT _id FROM carts WHERE id_user=${idUser} AND is_check_out=0
`, (err, results, fields) => {
      if (!err) {
        if (!results[1][0]) {
          const cartId = results[2].map(v => v._id)
          runQuery(`
          UPDATE userProfile SET balance=balance-${parseFloat(price)} WHERE id_user = ${idUser};
          UPDATE items INNER JOIN carts ON items._id = carts.id_item SET items.quantity = items.quantity - carts.total_items WHERE carts.id_user=${idUser} AND carts.is_check_out=0;
          UPDATE carts SET is_check_out=1 WHERE id_user=${idUser} AND is_check_out=0;
          INSERT INTO transactions(id_user,list_item,total_price) VALUES(${idUser},'${cartId.join(',')}',${price})
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
            return `${v.name} Only have ${v.quantity} But You want ${v.total_items}`
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

exports.GetHistoryTransaction = (idUser, params) => {
  console.log(idUser)
  return new Promise((resolve, reject) => {
    const { perPage, currentPage } = params
    runQuery(`
    SELECT COUNT(_id) AS total from transactions WHERE id_user=${idUser};
    SELECT T._id, T.total_price, T.created_at, GROUP_CONCAT(CONCAT_WS(',',
    CONCAT('{"name":"',C.name_item,'"'),
    CONCAT('"id":',C.id_item),
    CONCAT('"images":"',C.images_item,'"}')
    ) SEPARATOR '----') as listItem FROM transactions T INNER JOIN carts C ON FIND_IN_SET(C._id,T.list_item) > 0
    WHERE T.id_user=${idUser} GROUP BY T._id
    LIMIT 100 OFFSET ${(parseInt(currentPage) - 1) * parseInt(perPage)}
    `, (err, results) => {
      if (err) {
        return reject(err)
      } else {
        console.log(results)
        return resolve(results[2])
      }
    })
  })
}
