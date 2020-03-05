const Restaurants = require('express').Router()
// const checkAuthToken = require('../middleware/authMiddleware')

const { RegisterRestaurants } = require('../controllers/restaurants')

// Port Restaurants
Restaurants.post('/register', RegisterRestaurants)
// Restaurants.post('/login', LoginRestaurants)
// Restaurants.patch('/update', checkAuthToken, UpdateRestaurants)

module.exports = { Restaurants }
