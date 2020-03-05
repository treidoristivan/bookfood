// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const { runQuery } = require('../config/db')
const { RegisterRestaurants } = require('../models/restaurants')
// const { validateUsernamePassword } = require('../utility/validate')

exports.GetRestaurants = async (req, res, next) => {
  try {

  } catch (e) {

  }
}

exports.RegisterRestaurants = async (req, res, next) => {
  try {
    const { name } = req.body
    if (name) {
      if (name.val) {
        const statusRegister = await RegisterRestaurants({ name })
        if (statusRegister) {
          res.status(200).send({
            success: true,
            msg: `Selamat Bergabung di App Book&Food ${name}`
          })
        }
      } else {
        res.send({
          success: false,
          msg: `${name} Gagal bergabung`
        })
      }
    } else {
      throw new Error(`${name} Is No Exists`)
    }
  } catch (e) {
    console.log(e)
    res.status(201).send({
      success: false,
      msg: e.message
    })
  }
}
