const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
require('dotenv').config()
/* Import Controllers */
const { TopUp, Verify, ForgotPassword } = require('./src/controllers/users')
const { CheckOutItem } = require('./src/controllers/carts')
/* Import ROUTES */
const { RegisterUser, LoginUser, UpdateUser, GetProfile, DeleteAccount } = require('./src/controllers/users')
const Users = require('./src/routes/users')
const Restaurants = require('./src/routes/restaurants')
const itemCategories = require('./src/routes/itemCategories')
const items = require('./src/routes/items')
const carts = require('./src/routes/carts')
const Reviews = require('./src/routes/reviews')
const { GuestCategories, GuestItems, GuestRestaurants } = require('./src/routes/guests')

/* Middleware */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
/* Import Middleware */
const checkAuthToken = require('./src/middleware/authMiddleware')

/* CSRF settings */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, X-Requested-With, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    res.header('Acces-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE')
    return res.status(200).send({})
  }
  next()
})

/* Set ROUTES */

/* Redirect To api Docs */
app.get('/', (req, res, next) => {
  res.redirect('/api-docs')
})
/* API DOCS */
app.use('/api-docs', require('./src/docs/'))

app.post('/register', RegisterUser)
app.get('/verify', Verify)
app.post('/login', LoginUser)
app.post('/forgot-password', ForgotPassword)
app.post('/change-password', ForgotPassword)

app.get('/profile', checkAuthToken, GetProfile)
app.get('/profile/:id', checkAuthToken, GetProfile)
app.patch('/profile', checkAuthToken, UpdateUser)
app.delete('/profile', checkAuthToken, DeleteAccount)
app.post('/topup', checkAuthToken, TopUp)
app.use('/carts', carts)
app.get('/checkout', checkAuthToken, CheckOutItem)
app.use('/reviews', Reviews)

app.use('/users', Users)
app.use('/restaurants', Restaurants)
app.use('/categories', itemCategories)
app.use('/items', items)

app.use('/browse-items', GuestItems)
app.use('/browse-restaurants', GuestRestaurants)
app.use('/browse-categories', GuestCategories)

/* Server Listen */
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log('Server Listen on Port ' + PORT)
})
