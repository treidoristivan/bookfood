const users = require('../models/users')
const bcrypt = require('bcryptjs')

require('dotenv').config()

const GetAllUsers = async (req, res) => {
  try {
    //  Default Condition
    const params = {
      curentPage: req.query.page || 1,
      perPage: req.query.limit || 5,
      search: req.query.search || null,
      sort: req.query.sort || [{ keys: 'name', value: 0 }]
    }

    // Get Data
    const data = await users.get(false, params)

    // Send Data
    if (data) {
      res.send({
        success: true,
        data
      })
    } else {
      res.send({
        success: false,
        data: []
      })
    }
  } catch (e) {
    console.log(e)
    res.send({
      success: false,
      data: false
    })
  }
}

const GetDetailUsers = async (req, res) => {
  try {
    var { id } = req.params
    const data = await users.get(id)
    if (data) {
      res.send({
        success: true,
        data
      })
    } else {
      throw new Error('empty')
    }
  } catch (e) {
    res.send({
      success: false,
      msg: `The is no Users with id ${id}`
    })
  }
}
const CreateUsers = async (req, res) => {
  const { fullName, usersname, password } = req.body
  const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  try {
    const create = await users.create(fullName, usersname, hashPassword)
    if (create) {
      res.send({
        success: true,
        msg: 'Users has been created'
      })
    } else {
      res.send({
        success: false,
        msg: 'Users already exists'
      })
    }
  } catch (e) {
    res.send({
      success: false,
      msg: e.msg
    })
  }
}

const UpdateUsers = async (req, res) => {
  const { id } = req.params
  const key = Object.keys(req.body)
  const filllable = ['name', 'usersname', 'old_password']
  let params = key.map((v, i) => {
    if (v && filllable.includes(key[i])) {
      if (req.body[key[i]]) {
        return { keys: v, value: req.body[v] }
      } else {
        return null
      }
    } else {
      return null
    }
  }).filter(o => o)
  try {
    if (req.body.old_password) {
      /* Condition if users sending old_password at POST request */

      /* Get users data by Id parameter */
      const GetUsers = await users.get(id)

      /* Get users old password */
      const oldPassword = GetUsers.password

      /* variable checking wheter hash match or not */
      const compare = bcrypt.compareSync(req.body.old_password, oldPassword)

      /* Comparing new password and confirm password request */
      if (req.body.new_password === req.body.confirm_password) {
        if (compare) {
          /* If  hash is match */

          /* Changing old password parameter for database to password with new password hash */
          params = params.map(o => {
            if (o.keys === 'old_password') {
              return { keys: 'password', value: bcrypt.hashSync(req.body.new_password) }
            } else {
              return o
            }
          })

          /* Update password with model */
          const update = await users.update(id, params)

          /* If Update success or Not */
          if (update) {
            res.send({
              success: true,
              msg: `Users With id ${id} has been updated`
            })
          } else {
            res.send({
              success: false,
              msg: 'Failed to update users!'
            })
          }
        } else {
          res.send({
            success: false,
            msg: 'Wrong Old Password'
          })
        }
      } else {
        res.send({
          success: false,
          msg: ' Confirm Password Not Match'
        })
      }
    } else {
      /* Update password with model */
      const update = await users.update(id, params)

      /* If Update success or Not */
      if (update) {
        res.send({
          success: true,
          msg: `Users With id ${id} has been updated`
        })
      } else {
        res.send({
          success: false,
          msg: 'Failed to update users!'
        })
      }
    }
  } catch (e) {
    res.send({
      success: false,
      msg: e.message || 'Internal Server Error'
    })
  }
}
const DeleteUsers = async (req, res) => {
  try {
    const { id } = req.body
    if (await users.delete(parseInt(id))) {
      res.send({
        success: true,
        msg: `Users with id ${id} has been deleted`
      })
    } else {
      res.send({
        success: false,
        msg: 'Failed to delete users'
      })
    }
  } catch (e) {
    res.send({
      success: false,
      msg: 'Internal Server Error'
    })
  }
}

module.exports = {
  GetAllUsers,
  GetDetailUsers,
  CreateUsers,
  UpdateUsers,
  DeleteUsers
}
