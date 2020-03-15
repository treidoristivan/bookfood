const qs = require('qs')
const { GetItem, CreateItem, UpdateItem, DeleteItem } = require('../models/items')
const { GetIdCategory } = require('../models/itemCategories')
const { GetRestaurants } = require('../models/restaurants')
const { GetUser } = require('../models/users')
const { GetCategory } = require('../models/itemCategories')
const uploads = require('../middleware/uploadFiles')
exports.GetAllItem = async (req, res, next) => {
  try {
    const params = {
      currentPage: req.query.page || 1,
      perPage: req.query.limit || 5,
      search: req.query.search || '',
      sort: req.query.sort || [{ key: 'name', value: 0 }]
    }
    const column = ['_id', 'name', 'price', 'description']
    if (req.query.search) {
      params.search = Object.keys(params.search).map((v, i) => {
        if (column.includes(v)) {
          return { key: v, value: req.query.search[v] }
        } else {
          return ''
        }
      })
    }
    if (req.query.sort) {
      params.sort = Object.keys(params.sort).map((v, i) => {
        if (column.includes(v)) {
          return { key: v, value: req.query.sort[v] }
        } else {
          return { key: 'name', value: 0 }
        }
      })
    }
    if (req.query.search && req.query.search.category) {
      const idcategory = await GetIdCategory(req.query.search.category)
      params.id_category = idcategory || [0]
    }
    const dataItems = await GetItem(false, params)

    const totalPages = Math.ceil(dataItems.total / parseInt(params.perPage))
    const query = req.query
    query.page = parseInt(params.currentPage) + 1
    const nextPage = (parseInt(params.currentPage) < totalPages ? process.env.APP_URL.concat(`${req.baseUrl}?${qs.stringify(query)}`) : null)
    query.page = parseInt(params.currentPage) - 1
    const previousPage = (parseInt(params.currentPage) > 1 ? process.env.APP_URL.concat(`${req.baseUrl}${qs.stringify(query)}`) : null)

    const pagination = {
      currentPage: params.currentPage,
      nextPage,
      previousPage,
      totalPages,
      perPage: params.perPage,
      totalEntries: dataItems.total
    }
    if (dataItems.results.length > 0) {
      res.status(200).send({
        success: true,
        data: dataItems.results,
        pagination
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

exports.GetDetailItem = async (req, res, next) => {
  try {
    const dataitem = await GetItem(req.params.id)
    const relatedItem = await GetItem(false, {
      id_category: [dataitem.id_category],
      search: '',
      currentPage: 1,
      perPage: 5,
      sort: [{ key: 'name', value: 0 }]
    })
    if (dataitem) {
      res.status(200).send({
        success: true,
        data: {
          ...dataitem,
          relatedItem: relatedItem.results.filter(v => v._id !== dataitem._id)
        }

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

exports.CreateItem = async (req, res, next) => {
  try {
    await uploads(req, res, 'images')
    if (!req.body.id_restaurant || !req.body.id_category || !req.body.name || !req.body.price) {
      throw new Error('id_restaurant, id_category, name, and price is required')
    }
    const dataRestaurant = await GetRestaurants(req.body.id_restaurant)
    const dataCategory = await GetCategory(req.body.id_category)
    const dataUser = await GetUser(req.auth.id)
    if (!(dataRestaurant) || !(dataCategory)) {
      throw new Error(!(dataRestaurant) ? `Restaurants With id ${req.body.id_restaurant} Not Exists` : `Category With id ${req.body.id_category} Not Exists`)
    }
    if (!(dataUser._id === dataRestaurant.id_owner || dataUser.is_superadmin)) {
      return res.status(403).send({
        success: false,
        msg: 'To add Item to this Restaurant You Must Owner of Restaurant Or Superadmin'
      })
    }
    const columns = []
    const values = []
    const fillAble = ['id_restaurant', 'id_category', 'name', 'quantity', 'price', 'images', 'decription']
    fillAble.forEach((v) => {
      if (v && req.body[v]) {
        columns.push(v)
        values.push(req.body[v])
      }
    })
    if (req.file) {
      columns.push('images')
      values.push(req.file.path)
    }
    const item = await CreateItem({ columns, values })
    if (item) {
      res.status(201).send({
        success: true,
        msg: 'Success Create item',
        data: {
          name: req.body.name,
          id: item
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

exports.UpdateItem = async (req, res, next) => {
  try {
    await uploads(req, res, 'images')
    if (!(Object.keys(req.body).length > 0)) {
      throw new Error('Please Defined What you want to update')
    }
    const { id } = req.params
    const dataItem = await GetItem(id)
    const dataRestaurant = await GetRestaurants(dataItem.id_restaurant)
    const dataUser = await GetUser(req.auth.id)
    if (!(dataItem)) {
      throw new Error(`Item With id ${req.body.id_category} Not Exists`)
    }
    if (!(dataUser.is_superadmin || dataUser._id === dataRestaurant.id_owner)) {
      return res.status(403).send({
        success: false,
        msg: 'To Update Item You Must Owner of Restaurant Or Superadmin'
      })
    }
    const fillAble = ['id_category', 'name', 'quantity', 'price', 'images', 'decription']
    const params = fillAble.map((v) => {
      if (v && req.body[v]) {
        return { key: v, value: req.body[v] }
      } else {
        return null
      }
    }).filter(v => v)
    if (req.file) {
      params.push({ key: 'images', value: req.file.path })
    }
    if (params.length > 0) {
      const update = await UpdateItem(id, params)
      if (update) {
        res.status(201).send({
          success: true,
          msg: `Success Update Item With id ${id}`
        })
      } else {
        throw new Error('Failed to update Item')
      }
    } else {
      throw new Error('Something Wrong with your sented data')
    }
  } catch (e) {
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}

exports.DeleteItem = async (req, res, next) => {
  try {
    const { id } = req.params
    const dataItem = await GetItem(id)
    if (!(dataItem)) {
      throw new Error(`Item With id ${id} Not Exists`)
    }
    const dataRestaurant = await GetRestaurants(dataItem.id_restaurant)
    const dataUser = await GetUser(req.auth.id)

    if (!(dataUser.is_superadmin || dataUser._id === dataRestaurant.id_owner)) {
      return res.status(403).send({
        success: false,
        msg: 'To Delete Item You Must Owner of Restaurant Or Superadmin'
      })
    }
    if (!(await DeleteItem(id))) {
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
