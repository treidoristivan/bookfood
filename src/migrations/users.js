const users = `
CREATE TABLE IF NOT EXIST users(
  id int(11) PRIMARY KEY AUTO_INCREMENT, 
  username varchar(25),
  password varchar(25)
)
`
const usersDetail = `
CREATE TABLE IF NOT EXIST users(
  id int(11) PRIMARY KEY AUTO_INCREMENT, 
  idUsers int(11) FOREIGN KEY REFERENCES users(id),
  name varchar(50),
  birth_date date,
  email varchar(50),
  gender ENUM('L','P','other') DEFAULT 'other',
  images text
)
`
const usersAddress = `
CREATE TABLE IF NOT EXIST users(
  id int(11) PRIMARY KEY AUTO_INCREMENT, 
  idUsers int(11) FOREIGN KEY REFERENCES users(id),
  address text,
  isPrimary tinyint(1)
)
`
module.exports = { users, usersDetail, usersAddress }
