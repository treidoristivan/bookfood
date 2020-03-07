const { runQuery } = require('../config/db')
const uuid = require('uuid').v1
exports.GetUser = (id) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT * from users WHERE id=${id}`,
      (error, results, fields) => {
        if (error) {
          return reject(new Error(error))
        } else {
          return resolve(results[1][0])
        }
      }
    )
  })
}

exports.GetProfile = (id) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT u.id,u.username,p.fullname, p.email,p.balance,p.gender,p.address from userProfile p INNER JOIN users u ON p.idUser=u.id WHERE u.id=${id}`,
      (error, results, fields) => {
        if (error) {
          return reject(new Error(error))
        } else {
          return resolve(results[1][0])
        }
      }
    )
  })
}

exports.CreateUser = (data, isAdmin) => {
  return new Promise((resolve, reject) => {
    const { username, password } = data
    runQuery(`SELECT COUNT(*) AS total FROM users WHERE username = '${username}'`,
      (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        const { total } = results[1][0]
        if (!total) {
          runQuery(`INSERT INTO users(username, password${isAdmin ? ',isAdmin' : ''})VALUES('${username}','${password}'${isAdmin ? ',1' : ''})`,
            (err, results, fields) => {
              if (err) {
                console.log(results[1].solutions)
                return reject(new Error(err))
              } else {
                const codeVerify = uuid()
                runQuery(`INSERT INTO userProfile(idUser, codeVerify ) VALUES(${results[1].insertId},'${codeVerify}')`,
                  (err, results, fields) => {
                    if (!err) {
                      return resolve({ status: true, codeVerify })
                    }
                    console.log(err)
                  })
              }
            })
        } else {
          return reject(new Error('Username Already Exists'))
        }
      })
  })
}

exports.VerifyUser = (code) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT idUser from userProfile WHERE codeVerify= '${code}'`,
      (err, results, fields) => {
        if (!err) {
          if (results[1][0] && results[1][0].idUser) {
            const idUser = results[1][0].idUser
            runQuery(`
              UPDATE users SET status=1 WHERE id = ${idUser};
              UPDATE userProfile SET codeVerify = ${null} WHERE idUser =${idUser}
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

exports.GetCodeVerify = (username) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT id,username FROM users WHERE username = '${username}'`,
      (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        if (results[1].length > 0 && results[1][0]) {
          const codeVerify = uuid()
          const idUser = results[1][0].id
          runQuery(`UPDATE userProfile SET codeVerify = '${codeVerify}' WHERE idUser=${idUser}`,
            (err, results, fields) => {
              if (err) {
                return reject(new Error(err))
              }
              if (results[1].affectedRows) {
                return resolve({ status: true, codeVerify })
              } else {
                return reject(new Error('Failed to Get Code Verify'))
              }
            })
        } else {
          return reject(new Error('Username Not Exists'))
        }
      })
  })
}

exports.ChangePassword = (code, password) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT idUser from userProfile WHERE codeVerify= '${code}'`,
      (err, results, fields) => {
        if (!err) {
          if (results[1][0] && results[1][0].idUser) {
            const idUser = results[1][0].idUser
            runQuery(`
              UPDATE users SET password='${password}' WHERE id = ${idUser};
              UPDATE userProfile SET codeVerify = ${null} WHERE idUser =${idUser}
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
exports.UpdateProfile = (id, params) => {
  return new Promise((resolve, reject) => {
    const query = []
    const paramsUsers = params.slice().filter(v => ['username', 'password', 'status'].includes(v.key))
    const paramsProfile = params.slice().filter((v) => ['fullname', 'email', 'gender', 'balance', 'address', 'picture'].includes(v.key))
    if (paramsUsers.length > 0) {
      query.push(`UPDATE users SET ${paramsUsers.map(v => `${v.key} = '${v.value}'`).join(' , ')} WHERE id=${id}`)
    }
    if (paramsProfile.length > 0) {
      query.push(`UPDATE userProfile SET ${paramsProfile.map(v => `${v.key} = '${v.value}'`).join(' , ')} WHERE idUser=${id}`)
    }
    runQuery(`${query.map((v) => v).join(';')}`, (err, results, fields) => {
      if (err) {
        return reject(new Error(err))
      }
      console.log(results)
      return resolve(results[1].affectedRows)
    })
  })
}

exports.DeleteUser = (id) => {
  return new Promise((resolve, reject) => {
    runQuery(`DELETE FROM users WHERE id = ${id}`, (err, results, fields) => {
      if (err) {
        return reject(new Error(err))
      }
      return resolve(results[1].affectedRows)
    })
  })
}
