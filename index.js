const express = require('express')
const bodyParser = require('body-parser')
const app = express()

/* Import Routes */
const { Users } = require('./src/routes/users')
const { Restaurants } = require('./src/routes/restaurants')
const { Items } = require('./src/routes/items')
const { ItemsCategories } = require('./src/routes/itemsCategories')
const { Cart } = require('./src/routes/cart')

/* Import Controllers */
const { TopUp } = require('./src/controllers/users')

/* Import Middleware */
const { AuthToken } = require('./src/middleware/AuthToken')

/* Set Middleware */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* Set Routes */
app.post('/topup', AuthToken, TopUp)
app.use('/users', Users)
app.use('/restaurants', Restaurants)
app.use('/items', Items)
app.use('/itemscategories', ItemsCategories)
app.use('/cart', Cart)

/* Server Listen */
const PORT = 4444
app.listen(PORT, () => {
  console.log('Server Listen on Port ' + PORT)
})
