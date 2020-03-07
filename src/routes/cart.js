const Carts = require('express').Router()
const checkAuthToken = require('../middleware/authMiddleware')
const { GetAllCart, AddItem, UpdateItemCart, RemoveItemCart } = require('../controllers/cart')

Carts.get('/', checkAuthToken, GetAllCart)
Carts.post('/', checkAuthToken, AddItem)
Carts.put('/:id', checkAuthToken, UpdateItemCart)
Carts.delete('/:id', checkAuthToken, RemoveItemCart)
module.exports = Carts
