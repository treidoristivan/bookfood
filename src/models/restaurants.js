const { runQuery } = require('../config/db')

exports.RegisterRestaurants = (data) => {
  return new Promise((resolve, reject) => {
    const { name } = data
    runQuery(`SELECT COUNT(*) AS total FROM restaurants WHERE name=${name}`,
      (err, results, fields) => {
        if (err) {
          reject(new Error(err))
        }
        const { total } = results[1][0]
        if (!total) {
          runQuery(`INSERT INTO restaurants(name, password) VALUES('${name}')`,
            (err, results, fields) => {
              if (!err) {
                resolve(true)
              }
              console.log(err)
            })
        } else {
          reject(new Error(`name ${name}  Already Exists`))
        }
      })
  })
}
