const GuestItems = require('express').Router()
const GuestRestaurants = require('express').Router()
const GuestCategories = require('express').Router()

const { GetAllItem, GetDetailItem } = require('../controllers/items')
const { GetAllRestaurant, GetDetailRestaurant, GetRestaurantItems } = require('../controllers/restaurants')
const { GetAllCategory, GetDetailCategory } = require('../controllers/itemCategories')

GuestItems.get('/', GetAllItem)
GuestItems.get('/:id', GetDetailItem)

GuestRestaurants.get('/', GetAllRestaurant)
GuestRestaurants.get('/:id', GetDetailRestaurant)
GuestRestaurants.get('/:id/items', GetRestaurantItems)

GuestCategories.get('/', GetAllCategory)
GuestCategories.get('/:id', GetDetailCategory)

module.exports = {
  GuestCategories,
  GuestItems,
  GuestRestaurants
}
