const Cart = require('express').Router()
const { GetAllCart, AddItems } = require('../controllers/cart')
const CheckAuthToken = require('../middleware/AuthToken')

Cart.get('/', CheckAuthToken, GetAllCart)
Cart.post('/', CheckAuthToken, AddItems)

module.exports = { Cart }
