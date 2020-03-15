const { GetUserCart, UpdateItemCart, AddItem, RemoveItemCart, CheckOutItem } = require('../models/carts')
const { GetItem } = require('../models/items')
const { GetProfile } = require('../models/users')
exports.GetAllCart = async (req, res, next) => {
  try {
    const idUser = req.auth.id
    const carts = await GetUserCart(false, idUser, true)
    console.log(carts)
    if (carts) {
      return res.status(200).send({
        succces: true,
        data: carts
      })
    } else {
      return res.status(200).send({
        succces: true,
        data: false,
        msg: 'Data Cart Is Empty'
      })
    }
  } catch (e) {
    console.log(e)
    res.status(202).send({
      succces: false,
      msg: e.message
    })
  }
}

exports.AddItem = async (req, res, next) => {
  try {
    if (!req.body.id_item || !req.body.total_items) {
      throw new Error('id_item and total_items is required')
    }
    const idUser = req.auth.id
    const item = await GetItem(req.body.id_item)
    if (!item) {
      throw new Error(`Items With Id ${req.body.id_item} Not Exists`)
    }
    if (parseInt(item.quantity) < parseInt(req.body.total_items)) {
      throw new Error(`Not enough items, there are only ${item.quantity} item${item.quantity > 1 ? 's' : ''}`)
    }
    console.log(item)
    const dataItem = {
      idItem: item._id,
      nameItem: item.name,
      totalItem: req.body.total_items,
      totalPrice: parseFloat(req.body.total_items) * parseFloat(item.price)
    }
    const addedItem = await AddItem(idUser, dataItem)
    if (addedItem) {
      if (addedItem === 'update') {
        return res.status(201).send({
          success: true,
          msg: 'Item Already In Cart, Update Success'
        })
      } else {
        return res.status(201).send({
          success: true,
          msg: 'Success Added Item to Cart'
        })
      }
    }
    throw new Error('Failed to Added Item')
  } catch (e) {
    console.log(e)
    res.status(202).send({
      succces: false,
      msg: e.message
    })
  }
}

exports.UpdateItemCart = async (req, res, next) => {
  try {
    if (!req.body.total_items) {
      throw new Error('total_items is required')
    }
    const idUser = req.auth.id
    const idItemCart = req.params.id
    const itemCart = await GetUserCart(idItemCart, idUser)
    if (!itemCart) {
      throw new Error(`items With id ${idItemCart} Not In Cart`)
    }
    const item = await GetItem(itemCart.id_item)
    if (!item) {
      throw new Error('This Item Not Exists AnyMore')
    }
    const updateItemCart = await UpdateItemCart(idItemCart, idUser, {
      totalItem: req.body.total_items,
      totalPrice: parseFloat(req.body.total_items) * parseFloat(item.price)
    })
    if (updateItemCart) {
      res.status(200).send({
        success: true,
        msg: `Total Items with name "${itemCart.name_item}" in Your Cart Has been Update`
      })
    } else {
      throw new Error('Failed To Update!! Items Not In Cart')
    }
  } catch (e) {
    console.log(e)
    res.status(202).send({
      succces: false,
      msg: e.message
    })
  }
}

exports.RemoveItemCart = async (req, res, next) => {
  try {
    const idUser = req.auth.id
    const idItemCart = req.params.id
    if (!(await RemoveItemCart(idItemCart, idUser))) {
      throw new Error('Failed To Remove!! Items Not In Cart')
    }
    res.status(200).send({
      success: true,
      msg: "Success to Remove Items From Cart's"
    })
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}

exports.CheckOutItem = async (req, res, next) => {
  try {
    const idUser = req.auth.id
    const cart = await GetUserCart(false, idUser)
    if (!(cart)) {
      throw new Error('You Dont Have Item In Cart')
    }
    const dataUser = await GetProfile(idUser)
    if (dataUser.balance < cart.totalPrice) {
      throw new Error('You Dont Have Enough balance')
    }
    const checkout = await CheckOutItem(idUser, parseFloat(cart.totalPrice))
    if (checkout) {
      res.status(200).send({
        success: true,
        msg: "Success to Checkout Items From Cart's"
      })
    } else {
      throw new Error('Failet To Checkout Items In Cart')
    }
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}
