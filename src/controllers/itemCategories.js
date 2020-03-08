const qs = require('qs')
const { GetCategories, CreateCategories, UpdateCategories, DeleteCategories } = require('../models/itemCategories')

exports.GetAllCategories = async (req, res, next) => {
  try {
    const params = {
      currentPage: req.query.page || 1,
      perPage: req.query.limit || 5,
      search: req.query.search || '',
      sort: req.query.sort || [{ key: 'name', value: 0 }]
    }
    const column = ['id', 'name']
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
    const dataCategories = await GetCategories(false, params)

    const totalPages = Math.ceil(dataCategories.total / parseInt(params.perPage))
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
      totalEntries: dataCategories.total
    }
    if (dataCategories.results.length > 0) {
      res.status(200).send({
        success: true,
        data: dataCategories.results,
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

exports.GetDetailCategories = async (req, res, next) => {
  try {
    const dataCategories = await GetCategories(req.params.id)
    if (dataCategories) {
      res.status(200).send({
        success: true,
        data: dataCategories
      })
    } else {
      res.status(200).send({
        success: true,
        data: false,
        msg: `Categories With id ${req.params.id} Not Exists`
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

exports.CreateCategories = async (req, res, next) => {
  try {
    if (!req.body.name) {
      throw new Error('name is required')
    }
    const categories = await CreateCategories(req.body.name)
    if (categories) {
      res.status(201).send({
        success: true,
        msg: 'Success Create Categories',
        data: {
          name: req.body.name,
          id: categories
        }
      })
    } else {
      throw new Error('Failed to Create Review')
    }
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}

exports.UpdateCategories = async (req, res, next) => {
  try {
    if (!(req.body.name)) {
      throw new Error('name is required')
    }
    const { id } = req.params
    const update = await UpdateCategories(id, req.body.name)
    if (update) {
      res.status(201).send({
        success: true,
        msg: `Success Update Categories With id ${id}`
      })
    }
  } catch (e) {
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}

exports.DeleteCategories = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!(await DeleteCategories(id))) {
      throw new Error(`Failed To Delete Categories With id ${id}`)
    }
    res.status(200).send({
      success: true,
      msg: `Success to Delete Categories With id ${id}`
    })
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}
