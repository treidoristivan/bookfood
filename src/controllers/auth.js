const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { runQuery } = require('../config/db')
const { RegisterUser } = require('../models/users')
const { validateUsernamePassword } = require('../utility/validate')

exports.RegisterUser = async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (username && password) {
      const validate = validateUsernamePassword(username, password)
      if (validate.val) {
        const hashPassword = bcrypt.hashSync(password)
        const statusRegister = await RegisterUser({ username, password: hashPassword })
        if (statusRegister) {
          res.status(201).send({
            success: true,
            msg: 'Register Success, Please Login'
          })
        }
      } else {
        throw new Error(validate.message)
      }
    } else {
      throw new Error('Username and Password is Required')
    }
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}

exports.LoginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (username && password) {
      const dataLogin = await new Promise((resolve, reject) => {
        runQuery(`SELECT _id,username,password FROM users WHERE username='${username}'`,
          (err, results) => {
            if (!err && results[1].length > 0 && bcrypt.compareSync(password, results[1][0].password)) {
              const userData = { username }
              resolve(userData)
            } else {
              reject(new Error(err || 'Username Or Password Wrong'))
            }
          })
      })
      const token = jwt.sign(dataLogin, process.env.APP_KEY, { expiresIn: '1H' })
      res.send({
        success: true,
        msg: 'Login Success',
        data: {
          token
        }
      })
    } else {
      throw new Error('Username and Password is Required')
    }
  } catch (e) {
    console.log(e)
    res.status(401).send({
      success: false,
      msg: e.message
    })
  }
}
