const express = require('express')
const bodyParser = require('body-parser')
const app = express()

/* Import Controllers */
const { TopUp, Verify, ForgotPassword } = require('./src/controllers/users')
const { CheckOutItem } = require('./src/controllers/cart')

/* Import ROUTES */
const { RegisterUser, LoginUser, UpdateUser, GetProfile, DeleteProfile } = require('./src/controllers/users')
const Users = require('./src/routes/users')
const Restaurant = require('./src/routes/restaurant')
const itemCategories = require('./src/routes/itemCategories')
const items = require('./src/routes/items')
const cart = require('./src/routes/cart')
const Reviews = require('./src/routes/reviews')
const { GuestCategories, GuestItems, GuestRestaurant } = require('./src/routes/guest')

/* Middleware */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* Import Middleware */
const checkAuthToken = require('./src/middleware/authMiddleware')

/* Set ROUTES */
app.post('register', RegisterUser)
app.get('/verify', Verify)
app.post('/login', LoginUser)
app.post('/forgot-password', ForgotPassword)

// G
app.get('/profile', checkAuthToken, GetProfile)
app.get('profile/:id', checkAuthToken, GetProfile)
app.patch('/profile', checkAuthToken, UpdateUser)
app.delete('/profile', checkAuthToken, DeleteProfile)

// G
app.post('/topup', checkAuthToken, TopUp)
app.use('/cart', cart)
app.get('/checkout', checkAuthToken, CheckOutItem)
app.use('/reviews', Reviews)
app.use('/reviews/:id', Reviews)

// G
app.use('/users', Users)
app.use('/restaurant', Restaurant)
app.use('/categories', itemCategories)
app.use('/items', items)

// G
app.use('/browse-items', GuestItems)
app.use('/browse-restaurant', GuestRestaurant)
app.use('/browse-categories', GuestCategories)

/* Server Listen */
const PORT = 4444
app.listen(PORT, () => {
  console.log('Server Listen on Port ' + PORT)
})
