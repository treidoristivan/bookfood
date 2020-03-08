const Users = require('express').Router()
const checkAuthToken = require('../middleware/authMiddleware')
const permission = require('../middleware/authPermissions')
const { GetProfile, GetAllUser, DeleteProfile } = require('../controllers/users')

Users.get('/', checkAuthToken, permission.admin, GetAllUser)
Users.get('/:id', checkAuthToken, permission.admin, GetProfile)
Users.delete('/:id', checkAuthToken, permission.superadmin, DeleteProfile)

module.exports = Users
