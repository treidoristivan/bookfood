const GuestItems = require('express').Router()
const GuestRestaurant = require('express').Router()
const GuestCategories = require('express').Router()

const { GetAllItem, GetDetailItem } = require('../controllers/items')
const { GetAllRestaurant, GetDetailRestaurant } = require('../controllers/restaurant')
const { GetAllCategories, GetDetailCategories } = require('../controllers/itemCategories')

GuestItems.get('/', GetAllItem)
GuestItems.get('/:id', GetDetailItem)

GuestRestaurant.get('/', GetAllRestaurant)
GuestRestaurant.get('/:id', GetDetailRestaurant)

GuestCategories.get('/', GetAllCategories)
GuestCategories.get('/:id', GetDetailCategories)

module.exports = {
  GuestCategories,
  GuestItems,
  GuestRestaurant
}
