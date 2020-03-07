
const cartT = `
CREATE TABLE IF NOT EXISTS cart(
id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
idUser INT(11) UNSIGNED NOT NULL,
idItem INT(11) UNSIGNED NOT NULL,
nameItem VARCHAR(60) NOT NULL,
totalItem INT(11) UNSIGNED DEFAULT 0,
totalPrice DECIMAL(10,2) UNSIGNED NOT NULL,
checkOut TINYINT(1) DEFAULT 0,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
)
`
const transcationsT = `
CREATE TABLE IF NOT EXISTS transcations(
  id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  idUser INT(11) UNSIGNED NOT NULL,
  listItem TEXT,
  totalPrice DECIMAL(10,2) UNSIGNED NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`
const cartF = `
ALTER TABLE cart
ADD CONSTRAINT FK_User
  FOREIGN KEY (idUser) REFERENCES users(id)
  ON DELETE CASCADE
`
const transcationsF = `
  ALTER TABLE transcations
  ADD CONSTRAINT FK_User
    FOREIGN KEY (idUser) REFERENCES users(id)
    ON DELETE CASCADE
`
exports.queryTable = [
  cartT,
  transcationsT
]
exports.queryForeign = [
  cartF,
  transcationsF
]
