const { GetItems, CreateItems, UpdateItems, DeleteItems } = require('../models/items')
const { GetRestaurants } = require('../models/restaurants')
const { GetUsers } = require('../models/users')
const { GetCategory } = require('../models/itemCategories')

exports.GetAllItems = async (req, res, next) => {
  try {
    const dataItems = await GetItems(false, { p: 'ram' })
    if (dataItems.length > 0) {
      res.status(200).send({
        success: true,
        data: dataItems
      })
    } else {
      res.status(200).send({
        success: true,
        data: false,
        msg: 'Data is Empty'
      })
    }
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}

exports.GetDetailItems = async (req, res, next) => {
  try {
    const dataitems = await GetItems(req.params.id)
    if (dataitems) {
      res.status(200).send({
        success: true,
        data: dataitems
      })
    } else {
      res.status(200).send({
        success: true,
        data: false,
        msg: `Item With id ${req.params.id} Not Exists`
      })
    }
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}

exports.CreateItems = async (req, res, next) => {
  try {
    if (!req.body.id_restaurant || !req.body.id_category || !req.body.name || !req.body.price) {
      throw new Error('id_restaurant, id_category, name, and price is required')
    }
    const dataRestaurant = await GetRestaurants(req.body.id_restaurant)
    const dataCategory = await GetCategory(req.body.id_category)
    const dataUser = await GetUsers(req.auth.id)
    if (!(dataRestaurant) || !(dataCategory)) {
      throw new Error(!(dataRestaurant) ? `Restaurants With id ${req.body.id_restaurant} Not Exists` : `Category With id ${req.body.id_category} Not Exists`)
    }
    if (!(dataUser.id === dataRestaurant.idOwner || dataUser.is_superadmin)) {
      return res.status(403).send({
        success: false,
        msg: 'To add Item to this Restaurant You Must Owner of Restaurant Or Superadmin'
      })
    }
    let columns = []
    let values = []
    const fillAble = ['id_restaurant', 'id_category', 'name', 'price', 'images', 'decription']
    Object.keys(req.body).forEach((v) => {
      if (v && fillAble.includes(v) && req.body[v]) {
        columns.push(v)
        values.push(req.body[v])
      }
    })
    const items = await CreateItems({ columns, values })
    if (items) {
      res.status(201).send({
        success: true,
        msg: 'Success Create item',
        data: {
          name: req.body.name,
          id: items
        }
      })
    }
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}

exports.UpdateItems = async (req, res, next) => {
  try {
    if (!(Object.keys(req.body).length > 0)) {
      throw new Error('Please Defined What you want to update')
    }
    const { id } = req.params
    const dataItems = await GetItems(id)
    const dataRestaurant = await GetRestaurants(dataItems.id_restaurant)
    const dataUser = await GetUsers(req.auth.id)
    if (!(dataItems)) {
      throw new Error(`Item With id ${req.body.id_category} Not Exists`)
    }
    if (!(dataUser.is_superadmin || dataUser.id === dataRestaurant.idOwner)) {
      return res.status(403).send({
        success: false,
        msg: 'To Update Item You Must Owner of Restaurant Or Superadmin'
      })
    }
    const fillAble = ['id_category', 'name', 'price', 'images', 'decription']
    const params = Object.keys(req.body).map((v) => {
      if (v && fillAble.includes(v) && req.body[v]) {
        return { key: v, value: req.body[v] }
      } else {
        return null
      }
    }).filter(v => v)
    const update = await UpdateItems(id, params)
    if (update) {
      res.status(201).send({
        success: true,
        msg: `Success Update Restaurant With id ${id}`
      })
    }
  } catch (e) {
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}

exports.DeleteItems = async (req, res, next) => {
  try {
    const { id } = req.params
    const dataItem = await GetItems(id)
    if (!(dataItem)) {
      throw new Error(`Item With id ${id} Not Exists`)
    }
    const dataRestaurant = await GetRestaurants(dataItem.id_restaurant)
    const dataUser = await GetUsers(req.auth.id)

    if (!(dataUser.is_superadmin || dataUser.id === dataRestaurant.idOwner)) {
      return res.status(403).send({
        success: false,
        msg: 'To Delete Item You Must Owner of Restaurant Or Superadmin'
      })
    }
    if (!(await DeleteItems(id))) {
      throw new Error(`Failed To item Category With id ${id}`)
    }
    return res.status(200).send({
      success: true,
      msg: `Success to Delete Items With id ${id}`
    })
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}