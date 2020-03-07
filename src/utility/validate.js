
const validateUsername = (username) => {
  const regxUsername = /^[a-z0-9]{6,}/
  if (regxUsername.test(username)) {
    return { val: true }
  } else {
    return { val: false, message: 'Username only contain lowercase letters or numbers only and minimal six character' }
  }
}
const validatePassword = (password) => {
  const regxUsername = /^.{8,}/
  if (regxUsername.test(password)) {
    return { val: true }
  } else {
    return { val: false, message: 'Password Must Contain Minimal eight character' }
  }
}
const validateUsernamePassword = (username, password) => {
  const valUsername = validateUsername(username)
  const valPassword = validatePassword(password)
  if (valUsername.val && valPassword.val) {
    return { val: true }
  } else {
    return {
      val: false,
      message: valUsername.message || valPassword.message
    }
  }
}
module.exports = {
  validateUsernamePassword
}
