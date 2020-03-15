const qs = require('qs')
const { GetReview, GetReviewItem, CreateReview, UpdateReview, DeleteReview } = require('../models/reviews')
const { GetItem } = require('../models/items')

exports.GetAllReview = async (req, res, next) => {
  try {
    const idUser = req.auth ? req.auth.id : 0
    const params = {
      currentPage: req.query.page || 1,
      perPage: req.query.limit || 5,
      search: req.query.search || '',
      sort: req.query.sort || [{ key: '_id', value: 0 }]
    }
    const column = ['_id', 'rating', 'review']
    if (req.query.search) {
      params.search = Object.keys(params.search).map((v, i) => {
        if (column.includes(v)) {
          return { key: v, value: req.query.search[v] }
        } else {
          return [{ key: '_id', value: 0 }]
        }
      })
    }
    if (req.query.sort) {
      params.sort = Object.keys(params.sort).map((v, i) => {
        if (column.includes(v)) {
          return { key: v, value: req.query.sort[v] }
        } else {
          return { key: '_id', value: 0 }
        }
      })
    }
    const dataReview = await GetReview(false, idUser, params)

    const totalPages = Math.ceil(dataReview.total / parseInt(params.perPage))
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
      totalEntries: dataReview.total
    }
    if (dataReview.results.length > 0) {
      res.status(200).send({
        success: true,
        data: dataReview.results,
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
exports.GetAllReviewItem = async (req, res, next) => {
  try {
    const idItem = req.params.id
    const params = {
      currentPage: req.query.page || 1,
      perPage: req.query.limit || 5,
      search: req.query.search || '',
      sort: req.query.sort || [{ key: '_id', value: 0 }]
    }
    const column = ['_id', 'rating', 'review']
    if (req.query.search) {
      params.search = Object.keys(params.search).map((v, i) => {
        if (column.includes(v)) {
          return { key: v, value: req.query.search[v] }
        } else {
          return [{ key: '_id', value: 0 }]
        }
      })
    }
    if (req.query.sort) {
      params.sort = Object.keys(params.sort).map((v, i) => {
        if (column.includes(v)) {
          return { key: v, value: req.query.sort[v] }
        } else {
          return { key: '_id', value: 0 }
        }
      })
    }
    const dataReview = await GetReviewItem(idItem, params)

    const totalPages = Math.ceil(dataReview.total / parseInt(params.perPage))
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
      totalEntries: dataReview.total
    }
    if (dataReview.results.length > 0) {
      res.status(200).send({
        success: true,
        data: dataReview.results,
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
exports.GetDetailReview = async (req, res, next) => {
  try {
    if (!parseInt(req.params.id)) {
      throw new Error('Params Id Must Number')
    }
    const idUser = req.auth.id
    const dataReview = await GetReview(req.params.id, idUser)
    if (dataReview) {
      res.status(200).send({
        success: true,
        data: dataReview
      })
    } else {
      res.status(200).send({
        success: true,
        data: false,
        msg: `You Never Review item With id ${req.params.id}`
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

exports.CreateReview = async (req, res, next) => {
  try {
    const idUser = req.auth.id
    if (!(req.body.id_item || req.body.rating || req.body.review)) {
      throw new Error('Required id_item, rating and review')
    }
    if (!([1, 2, 3, 4, 5].includes(parseInt(req.body.rating)))) {
      throw new Error('Rating must be number with value 1-5')
    }
    const dataItem = await GetItem(req.body.id_item)
    if (!dataItem) {
      throw new Error('Item Not Exists')
    }
    const datareview = await CreateReview(idUser, req.body)
    if (datareview) {
      res.status(201).send({
        success: true,
        msg: 'Success Create Review'
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

exports.UpdateReview = async (req, res, next) => {
  try {
    if (!(Object.keys(req.body).length > 0)) {
      throw new Error('Please Defined What you want to update')
    }
    if (req.body.rating && !([1, 2, 3, 4, 5].includes(parseInt(req.body.rating)))) {
      throw new Error('Rating must be number with value 1-5')
    }
    const { id } = req.params
    const dataReview = await GetReview(id, req.auth.id)
    if (!(dataReview)) {
      throw new Error(`You Never Review Item With id ${id}`)
    }
    const fillAble = ['rating', 'review']
    const params = fillAble.map((v) => {
      if (v && req.body[v]) {
        return { key: v, value: req.body[v] }
      } else {
        return null
      }
    }).filter(v => v)
    if (params.length > 0) {
      const update = await UpdateReview(id, params)
      if (update) {
        res.status(201).send({
          success: true,
          msg: `Success Update Review With id ${id}`
        })
      } else {
        throw new Error('Failed to Update Review!')
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
exports.DeleteReview = async (req, res, next) => {
  try {
    const { id } = req.params
    const dataItem = await GetReview(id, req.auth.id)
    if (!(dataItem)) {
      throw new Error(`Never Review Item With id ${id}`)
    }
    if (!(await DeleteReview(id))) {
      throw new Error(`Failed To Delete Review With id ${id}`)
    }
    return res.status(200).send({
      success: true,
      msg: `Success to Delete Review With id ${id}`
    })
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}
