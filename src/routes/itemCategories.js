const itemCategories = require('express').Router()
const { GetAllCategories, GetDetailCategories, CreateCategories, UpdateCategories, DeleteCategories } = require('../controllers/itemCategories')
const checkAuthToken = require('../middleware/authMiddleware')
const permission = require('../middleware/authPermissions')

itemCategories.get('/', GetAllCategories)
itemCategories.get('/:id', GetDetailCategories)
itemCategories.post('/', checkAuthToken, permission.superadmin, CreateCategories)
itemCategories.put('/:id', checkAuthToken, permission.superadmin, UpdateCategories)
itemCategories.delete('/:id', checkAuthToken, permission.superadmin, DeleteCategories)

module.exports = itemCategories
