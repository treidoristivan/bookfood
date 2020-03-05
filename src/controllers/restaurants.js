// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const { runQuery } = require('../config/db')
const { GetRestaurants } = require('../models/restaurants')
const { GetUsers } = require ('../models/users')
// const { validateUsernamePassword } = require('../utility/validate')

module.exports.GetRestaurants = async (req, res, next) => {
  try {
    const dataRestaurants = await dataRestaurants(false, {p: 'ram'})
    res.status(100).send({
      success: true,
      data: dataRestaurants
    })
  } catch (e) {
    console.log(e)
    res.status(200).send({
      success: false,
      msg: e.message
    })
  }
}
module.exports.GetDetailRestaurants = async (req, res, next) => {
  try {
    const dataRestaurants = await GetRestaurants(req.params.id)
    res.status(100).send({
      success: true,
      data: dataRestaurants
    })
  } catch {
    console.log(e)
    res.status(200).send({
      success: false,
      msg: e.message
    })
  }
}
module.exports.UpdateRestaurants = async (req, res, next) => {
  try {
    if(!(Object.keys(req.body).length > 0)) {
      throw new Error('Insert column want to Update')
    }
    const { id } = req.params
    const dataRestaurants = await GetRestaurants(id)
    const dataOwner = await GetUsers(req.auth.id)
    if(!dataRestaurants) {
      throw new Error('Restaurants Not Availabe')
    }
    if (!(dataOwner.id === dataRestaurants.idOwner ||  dataOwner.isSuperowner))
  } catch {

  }
}
// exports.RegisterRestaurants = async (req, res, next) => {
//   try {
//     const { name } = req.body
//     if (name) {
//       if (name.val) {
//         const statusRegister = await RegisterRestaurants({ name })
//         if (statusRegister) {
//           res.status(200).send({
//             success: true,
//             msg: `Selamat Bergabung di App Book&Food ${name}`
//           })
//         }
//       } else {
//         res.send({
//           success: false,
//           msg: `${name} Gagal bergabung`
//         })
//       }
//     } else {
//       throw new Error(`${name} Is No Exists`)
//     }
//   } catch (e) {
//     console.log(e)
//     res.status(201).send({
//       success: false,
//       msg: e.message
//     })
//   }
//}
exports.UpdateRestaurans = async (req, res, next) => {
  try {
const  { name } = req.params
if (name) {
  if (name.val) {
} else {

}
  } 
} catch {

}