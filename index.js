const express = require('express')
const bodyParser = require('body-parser')
const app = express()

/* Import Controllers */
const { TopUp, Verify, ForgotPassword } = require('./src/controllers/users')
const { CheckOutItem } = require('./src/controllers/cart')

/* Import ROUTES */
const Users = require('./src/routes/users')
const Restaurant = require('./src/routes/restaurant')
const itemCategories = require('./src/routes/itemCategories')
const items = require('./src/routes/items')
const cart = require('./src/routes/cart')
const Reviews = require('./src/routes/reviews')

/* Middleware */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* Import Middleware */
const checkAuthToken = require('./src/middleware/authMiddleware')

/* Set ROUTES */
app.post('/topup', checkAuthToken, TopUp)
app.post('/verify', Verify)
app.post('/forgot-password', ForgotPassword)
app.get('/checkout', checkAuthToken, CheckOutItem)
app.use('/reviews', Reviews)
app.use('/users', Users)
app.use('/restaurant', Restaurant)
app.use('/categories', itemCategories)
app.use('/items', items)
app.use('/cart', cart)

/* Server Listen */
const PORT = 4444
app.listen(PORT, () => {
  console.log('Server Listen on Port ' + PORT)
})
