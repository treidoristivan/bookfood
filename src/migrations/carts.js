
const cartsT = `
CREATE TABLE IF NOT EXISTS carts(
_id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
id_user INT(11) UNSIGNED NOT NULL,
id_item INT(11) UNSIGNED NOT NULL,
name_item VARCHAR(60) NOT NULL,
total_items INT(11) UNSIGNED DEFAULT 0,
total_price DECIMAL(10,2) UNSIGNED NOT NULL,
is_check_out TINYINT(1) DEFAULT 0,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
)
`
const transactionsT = `
CREATE TABLE IF NOT EXISTS transactions(
  _id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_user INT(11) UNSIGNED NOT NULL,
  list_item TEXT,
  total_price DECIMAL(10,2) UNSIGNED NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`
const cartsF = `

ALTER TABLE carts
ADD CONSTRAINT FK_User_Cart
  FOREIGN KEY (id_user) REFERENCES users(_id)
  ON DELETE CASCADE
`
const transactionsF = `
 
  ALTER TABLE transactions
  ADD CONSTRAINT FK_User_Transcation
    FOREIGN KEY (id_user) REFERENCES users(_id)
    ON DELETE CASCADE
`
exports.queryTable = [
  cartsT,
  transactionsT
]
exports.queryForeign = [
  cartsF,
  transactionsF
]
