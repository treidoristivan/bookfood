const items = require('express').Router()
const { GetAllItem, GetDetailItem, CreateItem, UpdateItem, DeleteItem } = require('../controllers/items')
const checkAuthToken = require('../middleware/authMiddleware')
const permission = require('../middleware/authPermissions')

items.get('/', checkAuthToken, GetAllItem)
items.get('/:id', checkAuthToken, GetDetailItem)
items.post('/', checkAuthToken, permission.admin, CreateItem)
items.patch('/:id', checkAuthToken, permission.admin, UpdateItem)
items.delete('/:id', checkAuthToken, permission.admin, DeleteItem)
module.exports = items
