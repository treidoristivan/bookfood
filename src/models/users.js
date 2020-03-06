const { runQuery } = require('../config/db')
const uuid = require('uuid').v1

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
                runQuery(`INSERT INTO usersProfile(id_user) VALUES(${results[1].insertId})`,
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

exports.VerifyUser = (code) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT id_user FROM usersProfile WHERE verify='${code}'`, (err, results, fields) => {
      if (!err) {
        if (results[1][0] && results[1][0].id_user) {
          const idUser = results[1][0].id_user
          runQuery(`UPDATE users SET status=1 WHERE id = ${idUser};
          UPDATE usersProfile SET verify = ${null} WHERE id_user = ${idUser}`, (err, results, fields) => {
            if (err) {
              reject(new Error(err))
            } else {
              resolve(true)
            }
          })
        } else {
          return reject(new Error('Verification Failed, Code is Not Accepted !'))
        }
      } else {
        return reject(new Error(err))
      }
    })
  })
}

exports.VerifiedUser = (username) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT id,username FROM users WHERE username='${username}'`, (err, results, fields) => {
      if (err) {
        return reject(new Error(err))
      }
      if (results[1].length > 0 && results[1][0]) {
        const codeVerify = uuid()
        const idUser = results[1][0].id
        runQuery(`UPDATE usersProfile SET code_verify='${codeVerify}' WHERE id_user=${idUser}`, (err, results, fields) => {
          if (err) {
            return reject(new Error(err))
          }
          if (results[1].affectedRows) {
            return resolve({ status: true, codeVerify })
          } else {
            return reject(new Error('Failed Request Code Verify'))
          }
        })
      } else {
        return reject(new Error('Username is Required'))
      }
    })
  })
}
exports.ChangePassword = (code, password) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT id_user from usersProfile WHERE code_verify= '${code}'`,
      (err, results, fields) => {
        if (!err) {
          if (results[1][0] && results[1][0].id_user) {
            const idUser = results[1][0].id_user
            runQuery(`
              UPDATE users SET password='${password}' WHERE id = ${idUser};
              UPDATE usersProfile SET code_verify = ${null} WHERE id_user =${idUser}
            `, (err, results, fields) => {
              if (err) {
                reject(new Error(err))
              } else {
                resolve(true)
              }
            })
          } else {
            return reject(new Error('Code Verification Wrong'))
          }
        } else {
          return reject(new Error(err))
        }
      })
  })
}
exports.UpdateUser = (id, params) => {
  return new Promise((resolve, reject) => {
    const query = []
    const paramsUsers = params.slice().filter(v => ['username', 'password'].includes(v.keys))
    console.log(params)
    console.log(paramsUsers)
    const paramsProfile = params.slice().filter((v) => ['fullname', 'email', 'gender', 'address', 'picture'].includes(v.keys))
    if (paramsUsers.length > 0) {
      query.push(`UPDATE users SET ${paramsUsers.map(v => `${v.keys} = '${v.value}'`).join(' , ')} WHERE id=${id}`)
    }
    if (paramsProfile.length > 0) {
      query.push(`UPDATE usersProfile SET ${paramsProfile.map(v => `${v.keys} = '${v.value}'`).join(' , ')} WHERE id_user=${id}`)
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
