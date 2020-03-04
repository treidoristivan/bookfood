const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const { User } = require('./src/routes/users')
const { Auth } = require('./src/routes/auth')
const { checkAuthToken } = require('./src/middleware/AuthMiddleware')
const { Migration } = require('./src/routes/migrations')

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Router
app.use('/users', checkAuthToken, User)
app.use('/auth', Auth)
app.use('/migrate', Migration)

app.get('/', (req, res) => {
  res.send('Server Is Running')
})

app.listen(1111, () => {
  console.log('Server Running at Port BOOK & FOOD')
})
