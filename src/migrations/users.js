const usersT = `
  CREATE TABLE IF NOT EXISTS users(
  _id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(40) NOT NULL,
  password VARCHAR(100) NOT NULL,
  status TINYINT(1) DEFAULT 0,
  is_admin  TINYINT(1) DEFAULT 0,
  is_superadmin TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
)
`
const userProfileT = `
  CREATE TABLE IF NOT EXISTS userProfile(
    _id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_user INT(11) UNSIGNED NOT NULL,
    fullname VARCHAR(70) NULL,
    email VARCHAR(40) NULL,
    code_verify VARCHAR(60) DEFAULT NULL,
    balance DECIMAL(10,2) UNSIGNED DEFAULT 0,
    gender ENUM('male','female','other') DEFAULT NULL,
    address TEXT DEFAULT NULL,
    picture TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
  )
`
const userProfileF = `
  ALTER TABLE userProfile
  DROP CONSTRAINT IF EXISTS FK_User;
  ALTER TABLE userProfile
  ADD CONSTRAINT FK_User
    FOREIGN KEY (id_user) REFERENCES users(_id)
    ON DELETE CASCADE
`
exports.queryTable = [
  usersT,
  userProfileT
]
exports.queryForeign = [
  userProfileF
]
