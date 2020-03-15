const { runQuery } = require('../config/db')
const uuid = require('uuid').v1
const sendEmail = require('../utility/sendEmail')
exports.GetUser = (id) => {
  return new Promise((resolve, reject) => {
    runQuery(`SELECT * from users WHERE _id=${id}`,
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
exports.GetProfile = (id, params) => {
  return new Promise((resolve, reject) => {
    if (id) {
      runQuery(`SELECT u._id,u.username,p.fullname, p.email,p.balance,p.gender,p.address,p.picture from userProfile p INNER JOIN users u ON p.id_user=u._id WHERE u._id=${id}`,
        (error, results, fields) => {
          if (error) {
            return reject(new Error(error))
          } else {
            return resolve(results[1][0])
          }
        }
      )
    } else {
      const { perPage, currentPage, search, sort } = params
      const condition = `
          ${search && `WHERE ${search.map(v => `${v.key === '_id' || v.key === '_id' ? 'u.' + v.key : 'p.' + v.key} LIKE '%${v.value}%'`).join(' AND ')}`}
          ORDER BY ${sort.map(v => `${v.key === '_id' || v.key === '_id' ? 'u.' + v.key : 'p.' + v.key} ${!v.value ? 'ASC' : 'DESC'}`).join(' , ')}
          ${(parseInt(currentPage) && parseInt(perPage)) ? `LIMIT ${parseInt(perPage)} 
          OFFSET ${(parseInt(currentPage) - 1) * parseInt(perPage)}` : ''}
         `
      runQuery(`
        SELECT COUNT(u.username) AS total from userProfile p INNER JOIN users u ON p.id_user=u._id ${condition.substring(0, condition.indexOf('LIMIT'))};
        SELECT u._id,u.username,p.fullname, p.email,p.balance,p.gender,p.address,p.picture from userProfile p INNER JOIN users u ON p.id_user=u._id ${condition}
      `, (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        if (results[1][0]) {
          const { total } = results[1][0]
          return resolve({ results: results[2], total })
        } else {
          return resolve({ results: [], total: 0 })
        }
      })
    }
  })
}

exports.CreateUser = (data, isAdmin) => {
  return new Promise((resolve, reject) => {
    const { username, password, email } = data
    runQuery(`SELECT COUNT(*) AS total FROM users WHERE username = '${username}'`,
      (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        const { total } = results[1][0]
        if (!total) {
          runQuery(`INSERT INTO users(username, password${isAdmin ? ',is_admin' : ''})VALUES('${username}','${password}'${isAdmin ? ',1' : ''})`,
            (err, results, fields) => {
              if (err) {
                console.log(results[1].solutions)
                return reject(new Error(err))
              } else {
                const codeVerify = uuid()
                runQuery(`INSERT INTO userProfile(email,id_user, code_verify ) VALUES('${email}',${results[1].insertId},'${codeVerify}')`,
                  (err, results, fields) => {
                    if (!err) {
                      sendEmail(email, codeVerify).then((status) => {
                        return resolve(true)
                      }).catch((e) => {
                        reject(e)
                      })
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
    runQuery(`SELECT id_user from userProfile WHERE code_verify= '${code}'`,
      (err, results, fields) => {
        if (!err) {
          if (results[1][0] && results[1][0].id_user) {
            const idUser = results[1][0].id_user
            runQuery(`
              UPDATE users SET status=1 WHERE _id = ${idUser};
              UPDATE userProfile SET code_verify = ${null} WHERE id_user =${idUser}
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
    runQuery(`SELECT _id,username FROM users WHERE username = '${username}'`,
      (err, results, fields) => {
        if (err) {
          return reject(new Error(err))
        }
        if (results[1].length > 0 && results[1][0]) {
          const codeVerify = uuid()
          const idUser = results[1][0]._id
          runQuery(`UPDATE userProfile SET code_verify = '${codeVerify}' WHERE id_user=${idUser}`,
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
    runQuery(`SELECT id_user from userProfile WHERE code_verify= '${code}'`,
      (err, results, fields) => {
        if (!err) {
          if (results[1][0] && results[1][0].id_user) {
            const idUser = results[1][0].id_user
            runQuery(`
              UPDATE users SET password='${password}' WHERE _id = ${idUser};
              UPDATE userProfile SET code_verify = ${null} WHERE id_user =${idUser}
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
      query.push(`UPDATE users SET ${paramsUsers.map(v => `${v.key} = '${v.value}'`).join(' , ')} WHERE _id=${id}`)
    }
    if (paramsProfile.length > 0) {
      query.push(`UPDATE userProfile SET ${paramsProfile.map(v => `${v.key} = '${v.value}'`).join(' , ')} WHERE id_user=${id}`)
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
    runQuery(`DELETE FROM users WHERE _id = ${id}`, (err, results, fields) => {
      if (err) {
        return reject(new Error(err))
      }
      return resolve(results[1].affectedRows)
    })
  })
}
