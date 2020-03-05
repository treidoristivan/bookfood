const { runQuery } = require('../config/db')

exports.GetUser = (id) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT * from users WHERE id=${id}`,
      (error, results, fields) => {
        if (error) {
          reject(new Error(error))
        } else {
          resolve(results[1][0])
        }
      }
    )
  })
}

exports.RegisterUser = (data) => {
  return new Promise((resolve, reject) => {
    const { username, password } = data
    runQuery(`SELECT COUNT(*) AS total FROM users WHERE username = '${username}'`,
      (err, results, fields) => {
        if (err) {
          reject(new Error(err))
        }
        const { total } = results[1][0]
        if (!total) {
          runQuery(`INSERT INTO users(username,password) VALUES('${username}','${password}')`,
            (err, results, fields) => {
              if (err) {
                reject(new Error(err))
                console.log(results[1].solutions)
              } else {
                runQuery(`INSERT INTO userProfile(id_user) VALUES(${results[1].insertId})`,
                  (err, results, fields) => {
                    if (!err) {
                      resolve(true)
                    }
                    console.log(err)
                  })
              }
            })
        } else {
          reject(new Error('Username Already Exists'))
        }
      })
  })
}

exports.UpdateProfile = (id, params) => {
  return new Promise((resolve, reject) => {
    let query = []
    const paramsUsers = params.slice().filter(v => ['username', 'password'].includes(v.keys))
    console.log(params)
    console.log(paramsUsers)
    const paramsProfile = params.slice().filter((v) => ['fullname', 'email', 'gender', 'address', 'picture'].includes(v.keys))
    if (paramsUsers.length > 0) {
      query.push(`UPDATE users SET ${paramsUsers.map(v => `${v.keys} = '${v.value}'`).join(' , ')} WHERE id=${id}`)
    }
    if (paramsProfile.length > 0) {
      query.push(`UPDATE userProfile SET ${paramsProfile.map(v => `${v.keys} = '${v.value}'`).join(' , ')} WHERE id_user=${id}`)
    }
    console.log(query)
    runQuery(`${query.map((v) => v).join(';')}`, (err, results, fields) => {
      if (err) {
        reject(new Error(err))
      }
      console.log(results)
      resolve(true)
    })
  })
}
exports.DeleteUser = (id) => {
  return new Promise((resolve, reject) => {
    runQuery(`DELETE FROM users WHERE id=${id}`, (err, results, fields) => {
      if (err) {
        reject(new Error(err))
      }
      console.log({ results, fields })
      resolve(true)
    })
  })
}
