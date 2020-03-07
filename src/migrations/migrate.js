
/* Add All Query to Create Tables Into Array */

module.exports = {
  table: [
    ...require('./users').queryTable,
    ...require('./restaurant').queryTable,
    ...require('./items').queryTable,
    ...require('./cart').queryTable
  ],
  foreign: [
    ...require('./users').queryForeign,
    ...require('./restaurant').queryForeign,
    ...require('./items').queryForeign
  ]
}
