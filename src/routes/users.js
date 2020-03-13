const Users = require('express').Router()
const checkAuthToken = require('../middleware/authMiddleware')
const permission = require('../middleware/authPermissions')
const { GetProfile, GetAllUuser, DeleteUser } = require('../controllers/users')

Users.get('/', checkAuthToken, permission.admin, GetAllUuser)
Users.get('/:id', checkAuthToken, permission.admin, GetProfile)
Users.delete('/:id', checkAuthToken, permission.superadmin, DeleteUser)

module.exports = Users
