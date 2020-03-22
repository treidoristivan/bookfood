const Carts = require('express').Router()
const checkAuthToken = require('../middleware/authMiddleware')
const { GetAllCart, AddItem, UpdateItemCart, RemoveItemCart, GetDetailCart } = require('../controllers/carts')

Carts.get('/', checkAuthToken, GetAllCart)
Carts.get('/:id', checkAuthToken, GetDetailCart)
Carts.post('/', checkAuthToken, AddItem)
Carts.patch('/:id', checkAuthToken, UpdateItemCart)
Carts.delete('/:id', checkAuthToken, RemoveItemCart)
module.exports = Carts
