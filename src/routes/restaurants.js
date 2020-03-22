const Restaurant = require('express').Router()
const { GetAllRestaurant, GetDetailRestaurant, CreateRestaurant, UpdateRestaurant, DeleteRestaurant, GetRestaurantItems } = require('../controllers/restaurants')
const checkAuthToken = require('../middleware/authMiddleware')
const permission = require('../middleware/authPermissions')

Restaurant.get('/', checkAuthToken, GetAllRestaurant)
Restaurant.get('/:id', checkAuthToken, GetDetailRestaurant)
Restaurant.get('/:id/items', checkAuthToken, GetRestaurantItems)
Restaurant.post('/', checkAuthToken, permission.superadmin, CreateRestaurant)
Restaurant.patch('/:id', checkAuthToken, permission.admin, UpdateRestaurant)
Restaurant.delete('/:id', checkAuthToken, permission.superadmin, DeleteRestaurant)

module.exports = Restaurant
