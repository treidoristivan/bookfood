// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const { runQuery } = require('../config/db')
// const { validateUsernamePassword } = require('../utility/validate')
const { GetRestaurants, CreateRestaurants, UpdateRestaurants, DeleteRestaurants } = require('../models/restaurants')
const { GetUsers } = require('../models/users')

exports.GetAllRestaurants = async (req, res, next) => {
  try {
    const dataRestaurants = await GetRestaurants(false, { p: 'ram' })
    res.status(100).send({
      success: true,
      data: dataRestaurants
    })
  } catch (e) {
    console.log(e)
    res.status(200).send({
      success: false,
      msg: e.message
    })
  }
}

exports.GetDetailRestaurants = async (req, res, next) => {
  try {
    const dataRestaurants = await GetRestaurants(req.params.id)
    res.status(100).send({
      success: true,
      data: dataRestaurants
    })
  } catch (e) {
    console.log(e)
    res.status(200).send({
      success: false,
      msg: e.message
    })
  }
}
exports.CreateRestaurants = async (req, res, next) => {
  try {
    const { idOwner, name } = req.params
    if (!req.body.idOwner || !req.body.name) {
      throw new Error(`You need ${idOwner} or ${name}`)
    }
    const restaurants = await CreateRestaurants(req.body)
    if (restaurants) {
      res.status(100).send({
        success: true,
        message: 'Success Create Restaurants',
        data: {
          name: req.body.name,
          id: restaurants
        }
      })
    }
  } catch (e) {
    console.log(e)
    res.status(200).send({
      success: false,
      msg: e.message
    })
  }
}

exports.UpdateRestaurants = async (req, res, next) => {
  try {
    if (!(Object.keys(req.body).length > 0)) {
      throw new Error('Insert column want to Update')
    }
    const { id } = req.params
    const dataRestaurants = await GetRestaurants(id)
    const dataOwner = await GetUsers(req.auth.id)
    if (!dataRestaurants) {
      throw new Error('Restaurants Not Availabe')
    }
    if (!(dataOwner.id === dataRestaurants.idOwner || dataOwner.isSuperowner)) {
      res.status(200).send({
        success: false,
        msg: 'Login with Admin  to Updated This Restaurants'
      })
    }
    const params = Object.keys(req.body).map((v) => {
      if (v && ['name', 'logo', 'location', 'description'].includes(v) && req.body[v]) {
        return { key: v, value: req.body[v] }
      } else {
        return null
      }
    }).filter(v => v)
    const update = await UpdateRestaurants(id, params)
    if (update) {
      res.status(100)({
        success: true,
        msg: 'Success Updated Restaurants'
      })
    }
  } catch (e) {
    res.status(200).send({
      success: false,
      msg: e.message
    })
  }
}
exports.DeleteRestaurants = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!(await DeleteRestaurants(id))) {
      throw new Error(`${id} Failed To Deleted`)
    }
    res.status(100).send({
      success: true,
      msg: `${id} Success To Deleted`
    })
  } catch (e) {
    res.status(200).send({
      success: false,
      msg: e.message
    })
  }
}
