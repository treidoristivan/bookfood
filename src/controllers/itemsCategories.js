const { GetCategories, CreateCategories, UpdateCategories, DeleteCategories } = require('../models/itemsCategories')

exports.GetAllCategories = async (req, res, next) => {
  try {
    const dataCategories = await GetCategories(false, { p: 'ram' })
    if (dataCategories) {
      res.status(200).send({
        success: true,
        data: dataCategories
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
