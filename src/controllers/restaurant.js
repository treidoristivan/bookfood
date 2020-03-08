const qs = require('qs')
const { GetRestaurant, CreateRestaurant, UpdateRestaurant, DeleteRestaurant } = require('../models/restaurant')
const { GetUser } = require('../models/users')
exports.GetAllRestaurant = async (req, res, next) => {
  try {
    const params = {
      currentPage: req.query.page || 1,
      perPage: req.query.limit || 5,
      search: req.query.search || '',
      sort: req.query.sort || [{ key: 'name', value: 0 }]
    }
    const column = ['id', 'name', 'location', 'description']
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
    }
    const dataRestaurant = await GetRestaurant(false, params)

    const totalPages = Math.ceil(dataRestaurant.total / parseInt(params.perPage))
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
      totalEntries: dataRestaurant.total
    }
    if (dataRestaurant.results.length > 0) {
      res.status(200).send({
        success: true,
        data: dataRestaurant.results,
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

exports.GetDetailRestaurant = async (req, res, next) => {
  try {
    const dataRestaurant = await GetRestaurant(req.params.id)
    res.status(200).send({
      success: true,
      data: dataRestaurant
    })
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}

exports.CreateRestaurant = async (req, res, next) => {
  try {
    if (!req.body.idOwner || !req.body.name) {
      throw new Error('id owner and name is required')
    }
    const restaurant = await CreateRestaurant(req.body)
    if (restaurant) {
      res.status(201).send({
        success: true,
        msg: 'Success Create Restaurant',
        data: {
          name: req.body.name,
          id: restaurant
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

exports.UpdateRestaurant = async (req, res, next) => {
  try {
    if (!(Object.keys(req.body).length > 0)) {
      throw new Error('Please Defined What you want to update')
    }
    const { id } = req.params
    const dataRestaurant = await GetRestaurant(id)
    const dataOwner = await GetUser(req.auth.id)
    if (!dataRestaurant) {
      throw new Error('Restaurant Not Exists')
    }
    if (!(dataOwner.id === dataRestaurant.idOwner || dataOwner.isSuperadmin)) {
      res.status(403).send({
        success: false,
        msg: 'To Update You Must Superadmin Or Owner of this Restaurant'
      })
    }
    const params = Object.keys(req.body).map((v) => {
      if (v && ['name', 'logo', 'location', 'decription'].includes(v) && req.body[v]) {
        return { key: v, value: req.body[v] }
      } else {
        return null
      }
    }).filter(v => v)
    if (params.length > 0) {
      const update = await UpdateRestaurant(id, params)
      if (update) {
        res.status(201).send({
          success: true,
          msg: `Success Update Restaurant With id ${id}`
        })
      } else {
        throw new Error('Failed to update Restaurant')
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

exports.DeleteRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!(await DeleteRestaurant(id))) {
      throw new Error(`Failed To Delete Restaurant With id ${id}`)
    }
    res.status(200).send({
      success: true,
      msg: `Success to Delete Restaurant With id ${id}`
    })
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}
