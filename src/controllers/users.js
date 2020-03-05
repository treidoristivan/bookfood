const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { runQuery } = require('../config/db')
const { GetUser, RegisterUser, UpdateProfile, GetProfile, DeleteUser } = require('../models/users')
const { validateUsernamePassword } = require('../utility/validate')

exports.GetProfile = async (req, res, next) => {
  try {
    const profileUser = await GetProfile(req.auth.id)
    if (profileUser) {
      res.status(200).send({
        success: true,
        data: profileUser
      })
    }
    throw new Error('Something Wrong')
  } catch (e) {
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}
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
              const userData = { id: results[1][0]._id, username }
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

exports.UpdateUser = async (req, res, next) => {
  const { id } = req.auth
  const fillable = ['username', 'fullname', 'email', 'gender', 'address', 'picture']
  const params = Object.keys(req.body).map((v) => {
    if (v && fillable.includes(v) && req.body[v]) {
      return { keys: v, value: req.body[v] }
    } else {
      return null
    }
  }).filter(o => o)
  try {
    if (req.body.old_password) {
      const user = await GetUser(id)
      const oldPassword = user.password
      const { NewPassword, ConfirmPassword } = req.body
      if (!(NewPassword && ConfirmPassword)) {
        throw new Error('New Password or Confirm Password Not Defined')
      }
      if (!(NewPassword === ConfirmPassword)) {
        throw new Error('Confirm Password Not Match')
      }
      if (!(bcrypt.compareSync(req.body.old_password, oldPassword))) {
        throw new Error('Old Password Not Match')
      }
      params.push({ keys: 'password', value: bcrypt.hashSync(NewPassword) })
    }
    const update = await UpdateProfile(id, params)
    if (update) {
      res.send({
        success: true,
        msg: `User ${req.auth.username} has been updated`
      })
    } else {
      throw new Error('Failed to update user!')
    }
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}

exports.DeleteUser = async (req, res, next) => {
  const { id } = req.auth
  try {
    if (!(await DeleteUser(id))) {
      throw new Error('Failed to Delete User')
    }
    res.status(200).send({
      success: true,
      msg: 'Success Delete Your Account'
    })
  } catch (e) {
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}
