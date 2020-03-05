const items = require('express').Router()
const { GetAllitems, GetDetailitems, Createitems, Updateitems, Deleteitems } = require('../controllers/items')
const { checkAuthToken } = require('../middleware/AuthMiddleware')
const { checkPermissions } = require('../middleware/AuthPermissions')

// Port items
items.get('/get', GetAllitems)
items.get('/get', GetDetailitems)
items.post('/create', Createitems)
items.patch('/update', checkAuthToken, checkPermissions, Updateitems)
items.delete('/delete', checkAuthToken, checkPermissions, Deleteitems)

module.exports = { items }
