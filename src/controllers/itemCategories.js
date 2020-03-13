const qs = require('qs')
const { GetCategory, CreateCategory, UpdateCategory, DeleteCategory } = require('../models/itemCategories')
const { GetItem } = require('../models/items')

exports.GetAllCategory = async (req, res, next) => {
  try {
    const params = {
      currentPage: req.query.page || 1,
      perPage: req.query.limit || 5,
      search: req.query.search || [{ key: 'name', value: '' }],
      sort: req.query.sort || [{ key: 'name', value: 0 }]
    }
    const column = ['_id', 'name']
    if (req.query.search) {
      params.search = Object.keys(params.search).map((v, i) => {
        if (column.includes(v)) {
          return { key: v, value: req.query.search[v] }
        } else {
          return [{ key: 'name', value: '' }]
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
    const dataCategory = await GetCategory(false, params)

    const totalPages = Math.ceil(dataCategory.total / parseInt(params.perPage))
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
      totalEntries: dataCategory.total
    }
    if (dataCategory.results.length > 0) {
      res.status(200).send({
        success: true,
        data: dataCategory.results,
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

exports.GetDetailCategory = async (req, res, next) => {
  try {
    const dataCategory = await GetCategory(req.params.id)
    if (dataCategory) {
      const params = {
        currentPage: req.query.page || 1,
        perPage: req.query.limit || 5,
        search: req.query.search || [{ key: 'name', value: '' }],
        sort: req.query.sort || [{ key: 'name', value: 0 }],
        id_category: [req.params.id]
      }
      const column = ['_id', 'name', 'price', 'description']
      if (req.query.search) {
        params.search = Object.keys(params.search).map((v, i) => {
          if (column.includes(v)) {
            return { key: v, value: req.query.search[v] }
          } else {
            return [{ key: 'name', value: '' }]
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
      const dataItems = await GetItem(false, params)
      const totalPages = Math.ceil(dataItems.total / parseInt(params.perPage))
      const query = req.query
      query.page = parseInt(params.currentPage) + 1
      const nextPage = (parseInt(params.currentPage) < totalPages ? process.env.APP_URL.concat(`${req.originalUrl.substring(0, req.originalUrl.indexOf('?'))}?${qs.stringify(query)}`) : null)
      query.page = parseInt(params.currentPage) - 1
      const previousPage = (parseInt(params.currentPage) > 1 ? process.env.APP_URL.concat(`${req.originalUrl.substring(0, req.originalUrl.indexOf('?'))}${qs.stringify(query)}`) : null)
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
          ...dataCategory,
          dataItems: dataItems.results,
          pagination
        })
      } else {
        res.status(200).send({
          success: true,
          ...dataCategory,
          dataItems: false,
          msg: 'Items with this category is Empty'
        })
      }
    } else {
      res.status(200).send({
        success: true,
        data: false,
        msg: `Category With id ${req.params.id} Not Exists`
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

exports.CreateCategory = async (req, res, next) => {
  try {
    if (!req.body.name) {
      throw new Error('name is required')
    }
    const category = await CreateCategory(req.body.name)
    if (category) {
      res.status(201).send({
        success: true,
        msg: 'Success Create Category',
        data: {
          name: req.body.name,
          id: category
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

exports.UpdateCategory = async (req, res, next) => {
  try {
    if (!(req.body.name)) {
      throw new Error('name is required')
    }
    const { id } = req.params
    const update = await UpdateCategory(id, req.body.name)
    if (update) {
      res.status(201).send({
        success: true,
        msg: `Success Update Category With id ${id}`
      })
    }
  } catch (e) {
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}

exports.DeleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!(await DeleteCategory(id))) {
      throw new Error(`Failed To Delete Category With id ${id}`)
    }
    res.status(200).send({
      success: true,
      msg: `Success to Delete Category With id ${id}`
    })
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}
