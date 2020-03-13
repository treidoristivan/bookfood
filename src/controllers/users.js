const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const qs = require('qs')
const { runQuery } = require('../config/db')
const { GetUser, CreateUser, VerifyUser, GetCodeVerify, ChangePassword, UpdateProfile, GetProfile, DeleteUser } = require('../models/users')
const { validateUsernamePassword } = require('../utility/validate')
const uploads = require('../middleware/uploadFiles')
require('dotenv').config()

exports.GetAllUuser = async (req, res, next) => {
  try {
    const params = {
      currentPage: req.query.page || 1,
      perPage: req.query.limit || 5,
      search: req.query.search || '',
      sort: req.query.sort || [{ key: '_id', value: 0 }]
    }
    const column = ['_id', 'username', 'fullname', 'email', 'balance', 'gender', 'address']
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
    const dataUser = await GetProfile(false, params)

    const totalPages = Math.ceil(dataUser.total / parseInt(params.perPage))
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
      totalEntries: dataUser.total
    }
    if (dataUser.results.length > 0) {
      res.status(200).send({
        success: true,
        data: dataUser.results,
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
exports.GetProfile = async (req, res, next) => {
  try {
    const profileUser = await GetProfile(req.params.id || req.auth.id)
    if (profileUser) {
      return res.status(200).send({
        success: true,
        data: profileUser
      })
    } else {
      if (req.params.id) {
        throw new Error('Account Not Exists')
      } else {
        throw new Error('Your Account Has been deleted')
      }
    }
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
        const statusRegister = await CreateUser({ username, password: hashPassword }, false)
        if (statusRegister && statusRegister.status) {
          res.status(201).send({
            success: true,
            code_verify: statusRegister.codeVerify,
            msg: 'Register Success, Please Verify Your Account',
            url_to_verify: `${process.env.APP_URL}/verify?code=${statusRegister.codeVerify}`
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
        runQuery(`SELECT _id,username,password,status FROM users WHERE username='${username}'`,
          (err, results) => {
            if (!err && results[1].length > 0 && bcrypt.compareSync(password, results[1][0].password)) {
              if (!(results[1][0].status)) {
                return reject(new Error('Please Verify Your Account'))
              }
              const userData = { id: results[1][0]._id, username }
              return resolve(userData)
            } else {
              return reject(new Error(err || 'Username Or Password Wrong'))
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
  try {
    await uploads(req, res, 'picture')
    const { id } = req.auth
    const fillable = ['username', 'fullname', 'email', 'gender', 'address', 'picture']
    const params = Object.keys(req.body).map((v) => {
      if (v && fillable.includes(v) && req.body[v]) {
        return { key: v, value: req.body[v] }
      } else {
        return null
      }
    }).filter(o => o)
    if (req.file) {
      params.push({ key: 'picture', value: req.file.path })
    }
    if (req.body.old_password) {
      const user = await GetUser(id)
      const oldPassword = user.password
      if (!(req.body.new_password && req.body.confirm_password)) {
        throw new Error('New Password or Confirm Password Not Defined')
      }
      if (!(req.body.new_password === req.body.confirm_password)) {
        throw new Error('Confirm Password Not Match')
      }
      if (!(bcrypt.compareSync(req.body.old_password, oldPassword))) {
        throw new Error('Old Password Not Match')
      }
      params.push({ key: 'password', value: bcrypt.hashSync(req.body.new_password) })
    }
    if (params.length > 0) {
      const update = await UpdateProfile(id, params)
      if (update) {
        res.send({
          success: true,
          msg: `User ${req.auth.username} has been updated`
        })
      } else {
        throw new Error('Failed to update user!')
      }
    } else {
      throw new Error('Something Wrong with your sented data')
    }
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}

exports.DeleteAccount = async (req, res, next) => {
  try {
    const { id } = req.auth
    if (!(await DeleteUser(id))) {
      throw new Error('Failed to Delete Your Account')
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
exports.DeleteUser = async (req, res, next) => {
  try {
    const { id } = req.params.id
    if (!(await DeleteUser(id))) {
      throw new Error('Failed to Delete User')
    }
    res.status(200).send({
      success: true,
      msg: 'Success to Delete User'
    })
  } catch (e) {
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}

exports.TopUp = async (req, res, next) => {
  try {
    if (!req.body.nominal_topup) {
      throw new Error('Please Entry nominal_topup')
    }
    const dataUser = await GetProfile(req.auth.id)
    const updateBalance = await UpdateProfile(req.auth.id, [{ key: 'balance', value: parseFloat(dataUser.balance) + parseFloat(req.body.nominal_topup) }])
    if (updateBalance) {
      res.send({
        success: true,
        msg: `Success TopUp for ${req.auth.username}`
      })
    } else {
      throw new Error('Failed to TopUp!')
    }
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}

exports.Verify = async (req, res, next) => {
  try {
    if (!req.query.code) {
      throw new Error('Required Query code')
    }
    const verify = await VerifyUser(req.query.code)
    if (verify) {
      res.status(200).send({
        success: true,
        msg: 'Your Account Is Verify Please Login'
      })
    } else {
      throw new Error('Failed to Verify Your Account')
    }
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}

exports.ForgotPassword = async (req, res, next) => {
  try {
    if (!req.query.code) {
      if (!req.body.username) {
        throw new Error('Please Defined Username to Create New Password')
      }
      const code = await GetCodeVerify(req.body.username)
      if (code.status) {
        res.status(200).send({
          status: true,
          msg: 'Request Success, You Can change your password',
          code_verify: code.codeVerify,
          url_to_change: `${process.env.APP_URL}/forgot-password?code=${code.codeVerify}`
        })
      } else {
        throw new Error('Failed to Verify Your Account')
      }
    } else {
      if (!req.body.new_password || !req.body.confirm_password) {
        throw new Error('Please Defined new_password and confirm_password to update password')
      }
      if (req.body.new_password !== req.body.confirm_password) {
        throw new Error('Confirm Password not Match')
      }
      const changePassword = await ChangePassword(req.query.code, bcrypt.hashSync(req.body.new_password))
      if (changePassword) {
        return res.status(200).send({
          success: true,
          msg: 'Success Change Password'
        })
      } else {
        throw new Error('Failed To Change Password')
      }
    }
  } catch (e) {
    console.log(e)
    res.status(202).send({
      success: false,
      msg: e.message
    })
  }
}
