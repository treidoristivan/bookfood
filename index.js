const express = require('express')
const bodyParser = require('body-parser')
const app = express()

/* Import ROUTES */
const { Users } = require('./src/routes/users')
const { Restaurants } = require('./src/routes/restaurants')
const { Items } = require('./src/routes/items')

/* Middleware */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* Set ROUTES */
app.use('/users', Users)
app.use('/restaurants', Restaurants)
app.use('/items', Items)

/* Server Listen */
const PORT = 4444
app.listen(PORT, () => {
  console.log('Server Listen on Port ' + PORT)
})
