const Users = require('express').Router()
const checkAuthToken = require('../middleware/authMiddleware')
const permission = require('../middleware/authPermissions')
const { GetProfile, GetAllUuser, DeleteUser, GetAdminRestaurant, GetAllAdminItems } = require('../controllers/users')

Users.get('/', checkAuthToken, permission.admin, GetAllUuser)
Users.get('/restaurants', checkAuthToken, permission.admin, GetAdminRestaurant)
Users.get('/items', checkAuthToken, permission.admin, GetAllAdminItems)
Users.get('/:id', checkAuthToken, permission.admin, GetProfile)
Users.delete('/:id', checkAuthToken, permission.superadmin, DeleteUser)

module.exports = Users
