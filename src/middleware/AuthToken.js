const jwt = require('jsonwebtoken')
require('dotenv').config()

function checkToken (req, res, next) {
  try {
    let token = req.headers.authorization || ''
    if (!token) {
      throw new Error('Not Authorized')
    }
    token = token.replace(/Bearer\s*/, '')
    req.auth = jwt.verify(token, process.env.APP_KEY)
    next()
  } catch (e) {
    res.status(401).send({
      success: false,
      msg: e.message
    })
  }
}

module.exports = {
  checkToken
}
