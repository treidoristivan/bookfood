const Users = require('express').Router()
const checkAuthToken = require('../middleware/authMiddleware')
const permission = require('../middleware/authPermissions')
const { RegisterUser, LoginUser, UpdateUser, GetProfile, DeleteAccount, DeleteUser } = require('../controllers/users')

Users.get('/profile', checkAuthToken, GetProfile)
Users.post('/register', RegisterUser)
Users.post('/login', LoginUser)
Users.patch('/update', checkAuthToken, UpdateUser)
Users.delete('/delete', checkAuthToken, DeleteAccount)
Users.delete('/delete/:id', checkAuthToken, permission.superadmin, DeleteUser)

module.exports = Users
