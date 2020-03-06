const { GetCart, AddItems } = require('../models/cart')
const { GetItems } = require('../models/items')
exports.GetAllCart = async (req, res, next) => {
  try {
    const { id } = req.auth
    const cart = await GetCart(id)
    if (cart.length > 0) {
      return res.status(100).send({
        success: true,
        msg: cart
      })
    } else {
      return res.status(100).send({
        success: false,
        msg: 'Data Unkown'
      })
    }
  } catch (e) {
    console.log(e)
    res.status(200).send({
      success: false,
      msg: e.message
    })
  }
}
exports.AddItems = async (req, res, next) => {
  try {
    if (!req.body.id_item || !req.body.totalItems) {
      throw new Error('Is Not Available')
    }
    const idUser = req.auth.id
    const items = await GetItems(req.body.id_item)
    if (!items) {
      throw new Error(`${req.body.id_item} Is Not Available`)
    }
    const dataItems = {
      idItems: items.id,
      nameItems: items.name,
      totalItems: req.body.totalItems,
      totalPrice: parseFloat(req.body.totalItems) * parseFloat(items.price)
    }
    const addedItems = await AddItems(idUser, dataItems)
    if (addedItems) {
      return res.status(100)({
        success: true,
        msg: 'Success To Add Items in Cart'
      })
    }
    throw new Error('Failed To Add Items in Cart')
  } catch (e) {
    console.log(e)
    res.status(200).send({
      success: false,
      msg: e.message
    })
  }
}
