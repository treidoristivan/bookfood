const { runQuery } = require('../config/db')

module.exports = {
  admin: async (req, res, next) => {
    try {
      if (await checkPermission(req.auth, 'admin')) {
        next()
      } else {
        throw new Error("You Don't Have Permission Only Admin")
      }
    } catch (e) {
      res.status(403).send({
        success: false,
        msg: e.message
      })
    }
  },
  superadmin: async (req, res, next) => {
    try {
      if (await checkPermission(req.auth, 'superadmin')) {
        next()
      } else {
        throw new Error("You Don't Have Permission Only SuperAdmin")
      }
    } catch (e) {
      res.status(403).send({
        success: false,
        msg: e.message
      })
    }
  }
}

const checkPermission = (auth, role) => {
  return new Promise((resolve, reject) => {
    if (auth) {
      runQuery(`SELECT is_${role}${role === 'admin' ? ',is_superadmin' : ''} FROM users WHERE username='${auth.username}'`,
        (err, results, fields) => {
          if (err || !(results[1].length > 0)) {
            console.log(err)
            reject(new Error(err || 'Your Account Has Been Deleted'))
          } else {
            resolve(results[1][0][`is_${role}`] || (role === 'admin' ? results[1][0].is_superadmin : 0))
          }
        })
    } else {
      resolve(false)
    }
  })
}
