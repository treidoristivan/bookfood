const itemCategories = require('express').Router()
const { GetAllCategory, GetDetailCategory, CreateCategory, UpdateCategory, DeleteCategory } = require('../controllers/itemCategories')
const checkAuthToken = require('../middleware/authMiddleware')
const permission = require('../middleware/authPermissions')

itemCategories.get('/', GetAllCategory)
itemCategories.get('/:id', GetDetailCategory)
itemCategories.post('/', checkAuthToken, permission.superadmin, CreateCategory)
itemCategories.put('/:id', checkAuthToken, permission.superadmin, UpdateCategory)
itemCategories.delete('/:id', checkAuthToken, permission.superadmin, DeleteCategory)
module.exports = itemCategories
