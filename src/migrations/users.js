const users = `
  CREATE TABLE IF NOT EXISTS users(
  id int(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(40) NOT NULL,
  password VARCHAR(100) NOT NULL,
  code_verify VARCHAR(40) DEFAULT NULL,
  is_admin  TINYINT(1) DEFAULT 0,
  is_superadmin   TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
)
`
const usersProfile = `
  CREATE TABLE IF NOT EXISTS usersProfile(
    id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_user INT(11) UNSIGNED NOT NULL,
    fullname VARCHAR(70) NULL,
    email VARCHAR(40) NULL,
    gender ENUM('women','men') DEFAULT NULL,
    address TEXT DEFAULT NULL,
    picture TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
  )
`
const usersProfileForeign = `
  ALTER TABLE usersProfile
  ADD CONSTRAINT FK_User
    FOREIGN KEY (id_user) REFERENCES users(id)
    ON DELETE CASCADE 
`
exports.queryTable = [
  users,
  usersProfile
]
exports.queryForeign = [
  usersProfileForeign
]
