const db = require('../config/db')
// const bcrypt = require('bcryptjs')

module.exports = {
  get: (id, params) => {
    if (id) {
      return new Promise((resolve, reject) => {
        db.query(`SELECT * from users WHERE id=${id}`,
          (error, results, fields) => {
            if (error) {
              reject(new Error(error))
            } else {
              resolve(results[0])
            }
          }
        )
      })
    } else {
      return new Promise((resolve, reject) => {
        const { perPage, curentPage, search, sort } = params
        const condition = `
            ${search ? `WHERE ${search.map(v => `${v.keys} LIKE '%${v.value}%'`).join(' AND ')}` : ''}
            ORDER BY ${sort.map(v => `${v.keys} ${!v.value ? 'ASC' : 'DESC'}`).join(' , ')}
            ${(curentPage && perPage) && `LIMIT ${perPage} 
            OFFSET ${(parseInt(curentPage) - 1) * parseInt(perPage)}`}
          `
        db.query('SELECT COUNT(*) AS total from users',
          (error, results, fields) => {
            if (error) {
              reject(new Error(error))
            }
            console.log(results)
            if (results[0]) {
            // Destructing Total Data to Variable
              const { total } = results[0]
              db.query(`SELECT * from users ${condition}`, (error, results, fields) => {
                if (error) {
                  reject(new Error(error))
                } else {
                  console.log(results)
                  resolve({ results, total })
                }
              })
            } else {
              resolve({ results: [], total: 0 })
            }
          })
      })
    }
  },
  create: (name, username, password) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) as total from users WHERE username='${username}'`,
        (error, results, fields) => {
          if (!error) {
            const { total } = results[0]
            if (total !== 0) {
              resolve(false)
            } else {
              db.query(`INSERT INTO users(name,username,password) VALUES ('${name}', '${username}', '${password}')`,
                (error, results, fields) => {
                  if (error) {
                    reject(new Error(error))
                  }
                  console.log({ results, fields })
                  resolve(true)
                })
            }
          } else {
            console.log(error)
            throw new Error(error)
          }
        })
    })
  },
  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) as total from users WHERE id=${id}`,
        (error, results, fields) => {
          if (!error) {
            const { total } = results[0]
            if (total === 0) {
              resolve(false)
            } else {
              db.query(`DELETE FROM users WHERE id=${id}`,
                (error, results, fields) => {
                  if (error) {
                    reject(new Error(error))
                  }
                  console.log({ results, fields })
                  resolve(true)
                })
            }
          } else {
            console.log(error)
            throw new Error(error)
          }
        })
    })
  },
  update: (id, params) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) as total from users WHERE id=${id}`,
        (error, results, fields) => {
          if (!error) {
            const { total } = results[0]
            if (total === 0) {
              resolve(false)
            } else {
              db.query(`UPDATE users SET ${params.map(v => `${v.keys} = '${v.value}'`).join(' , ')} WHERE id=${id}`,
                (error, results, fields) => {
                  if (error) {
                    reject(new Error(error))
                  }
                  console.log({ results, fields })
                  resolve(true)
                })
            }
          } else {
            console.log(error)
            throw new Error(error)
          }
        })
    })
  }
}
