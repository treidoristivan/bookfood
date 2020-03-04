
const User = require('express').Router()
const { GetAllUsers, GetDetailUsers, CreateUsers, UpdateUsers, DeleteUsers } = require('../controllers/users')

// Menampilkan Data User
User.get('/', GetAllUsers)

// Menampilkan Data Detail User
User.get('/:id', GetDetailUsers)

// Membuat Data User
User.post('/', CreateUsers)

// Mengedit Data User
User.patch('/:id', UpdateUsers)

// Delete User
User.delete('/', DeleteUsers)

module.exports = { User }
