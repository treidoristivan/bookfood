const Auth = require('express').Router()
const { AuthLogin } = require('../controllers/auth')

Auth.post('/login', AuthLogin)

module.exports = { Auth }
