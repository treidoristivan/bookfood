const Restaurant = require('express').Router()
const { GetAllRestaurant, GetDetailRestaurant, CreateRestaurant, UpdateRestaurant, DeleteRestaurant } = require('../controllers/restaurant')
const checkAuthToken = require('../middleware/authMiddleware')
const permission = require('../middleware/authPermissions')

Restaurant.get('/', GetAllRestaurant)
Restaurant.get('/:id', GetDetailRestaurant)
Restaurant.post('/', checkAuthToken, permission.superadmin, CreateRestaurant)
Restaurant.patch('/:id', checkAuthToken, permission.admin, UpdateRestaurant)
Restaurant.delete('/:id', checkAuthToken, permission.superadmin, DeleteRestaurant)

module.exports = Restaurant
