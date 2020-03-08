const GuestItems = require('express').Router()
const GuestRestaurant = require('express').Router()
const GuestCategories = require('express').Router()

const { GetAllItem, GetDetailItem } = require('../controllers/items')
const { GetAllRestaurant, GetDetailRestaurant } = require('../controllers/restaurant')
const { GetAllCategory, GetDetailCategory } = require('../controllers/itemCategories')

GuestItems.get('/', GetAllItem)
GuestItems.get('/:id', GetDetailItem)

GuestRestaurant.get('/', GetAllRestaurant)
GuestRestaurant.get('/:id', GetDetailRestaurant)

GuestCategories.get('/', GetAllCategory)
GuestCategories.get('/:id', GetDetailCategory)

module.exports = {
  GuestCategories,
  GuestItems,
  GuestRestaurant
}
