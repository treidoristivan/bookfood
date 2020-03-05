const Restaurants = require('express').Router()
const { GetAllRestaurants, GetDetailRestaurants, CreateRestaurants, UpdateRestaurants, DeleteRestaurants } = require('../controllers/restaurants')
const { checkAuthToken } = require('../middleware/AuthMiddleware')
const { checkAuthPermissions } = require('../middleware/AuthPermissions')

// Port Restaurants
Restaurants.get('/get', GetAllRestaurants)
Restaurants.get('/get', GetDetailRestaurants)
Restaurants.post('/create', CreateRestaurants)
Restaurants.patch('/update', checkAuthToken, checkAuthPermissions, UpdateRestaurants)
Restaurants.delete('/delete', checkAuthToken, checkAuthPermissions, DeleteRestaurants)

module.exports = { Restaurants }
