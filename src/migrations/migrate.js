
/* Add All Query to Create Tables Into Array */

module.exports = {
  table: [
    ...require('./users').queryTable,
    ...require('./restaurants').queryTable,
    ...require('./items').queryTable,
    ...require('./carts').queryTable
  ],
  foreign: [
    ...require('./users').queryForeign,
    ...require('./restaurants').queryForeign,
    ...require('./items').queryForeign
  ]
}
