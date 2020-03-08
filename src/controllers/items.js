const qs = require('qs')
const { GetItem, CreateItem, UpdateItem, DeleteItem } = require('../models/items')
const { GetRestaurant } = require('../models/restaurant')
const { GetUser } = require('../models/users')
const { GetCategories, GetIdCategories } = require('../models/itemCategories')

exports.GetAllItem = async (req, res, next) => {
  try {
    const params = {
      currentPage: req.query.page || 1,
      perPage: req.query.limit || 5,
      search: req.query.search || '',
      sort: req.query.sort || [{ key: 'name', value: 0 }]
    }
    const column = ['id', 'name', 'price', 'description']
    if (req.query.search) {
      params.search = Object.keys(params.search).map((v, i) => {
        if (column.includes(v)) {
          return { key: v, value: req.query.search[v] }
        } else {
          return [{ key: 'name', value: 0 }]
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
    } if (req.query.search && req.query.search.category) {
      const idcategory = await GetIdCategories(req.query.search.category)
      params.idCategory = idcategory || [0]
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
    const relateditem = await GetItem(false, {
      idCategory: [dataitem.idCategory],
      search: '',
      currentPage: 1,
      perPage: 5,
      sort: ({ key: 'name', value: 0 })
    })
    if (dataitem) {
      res.status(200).send({
        success: true,
        data: {
          ...dataitem,
          relateditem: relateditem.results
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
    if (!req.body.idRestaurant || !req.body.idCategory || !req.body.name || !req.body.price) {
      throw new Error('idRestaurant, idCategory, name, and price is required')
    }
    const dataRestaurant = await GetRestaurant(req.body.idRestaurant)
    const dataCategory = await GetCategories(req.body.idCategory)
    const dataUser = await GetUser(req.auth.id)
    if (!(dataRestaurant) || !(dataCategory)) {
      throw new Error(!(dataRestaurant) ? `Restaurants With id ${req.body.idRestaurant} Not Exists` : `Category With id ${req.body.idCategory} Not Exists`)
    }
    if (!(dataUser.id === dataRestaurant.idOwner || dataUser.isSuperadmin)) {
      return res.status(403).send({
        success: false,
        msg: 'To add Item to this Restaurant You Must Owner of Restaurant Or Superadmin'
      })
    }
    const columns = []
    const values = []
    const fillAble = ['idRestaurant', 'idCategory', 'name', 'price', 'images', 'decription']
    Object.keys(req.body).forEach((v) => {
      if (v && fillAble.includes(v) && req.body[v]) {
        columns.push(v)
        values.push(req.body[v])
      }
    })
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
    if (!(Object.keys(req.body).length > 0)) {
      throw new Error('Please Defined What you want to update')
    }
    const { id } = req.params
    const dataItem = await GetItem(id)
    const dataRestaurant = await GetRestaurant(dataItem.idRestaurant)
    const dataUser = await GetUser(req.auth.id)
    if (!(dataItem)) {
      throw new Error(`Item With id ${req.body.idCategory} Not Exists`)
    }
    if (!(dataUser.isSuperadmin || dataUser.id === dataRestaurant.idOwner)) {
      return res.status(403).send({
        success: false,
        msg: 'To Update Item You Must Owner of Restaurant Or Superadmin'
      })
    }
    const fillAble = ['idCategory', 'name', 'quantity', 'price', 'images', 'decription']
    const params = Object.keys(req.body).map((v) => {
      if (v && fillAble.includes(v) && req.body[v]) {
        return { key: v, value: req.body[v] }
      } else {
        return null
      }
    }).filter(v => v)
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
    const dataRestaurant = await GetRestaurant(dataItem.idRestaurant)
    const dataUser = await GetUser(req.auth.id)

    if (!(dataUser.isSuperadmin || dataUser.id === dataRestaurant.idOwner)) {
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
