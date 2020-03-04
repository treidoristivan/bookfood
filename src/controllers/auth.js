const jwt = require('jsonwebtoken')
require('dotenv').config()

const AuthLogin = (req, res) => {
  const { username, password } = req.body
  if (username && password) {
    if ((username === 'admin') && (password === 'admin')) {
      const data = { email: 'admin@server.coj' }
      const token = jwt.sign(data, process.env.APP_KEY, { expiresIn: '15H' })
      res.send({
        success: true,
        msg: 'Login Success',
        data: {
          token
        }
      })
    }
  }
  res.send({
    success: false,
    msg: 'Wrong Username Or Password'
  })
}

module.exports = {
  AuthLogin
}
