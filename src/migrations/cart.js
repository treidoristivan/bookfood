const cartTable = `
CREATE TABLE IF NOT EXISTS cart(
id int(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
id_user int(11) UNSIGNED NOT NULL,
id_item int(11) UNSIGNED NOT NULL,
totalItems int(11) UNSIGNED DEFAULT 0,
totalPrice decimal(10,2) UNSIGNED NOT NULL,
checkOut tinyint default 0,
create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
update_at DATETIME ON UPDATE CURRENT_TIMESTAMP
)`

const cartTransactionTable = `
CREATE TABLE IF NOT EXISTS cartTransaction(
  id int(11) UNSIGNED PRIMARY KEY AUTO INCREMENT,
  id_user int(11) UNSIGNED NOT NULL,
  listItems text,
  totalPrice decimal(10,2) UNSIGNED NOT NULL,
  create_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`

const cartForeign = `
ALTER TABLE cart(
ADD CONSTRAINT FK_User
  FOREIGN KEY (id_user) REFERENCES users(id)
  ON DELETE CASCADE
  ON UPDATE CASCADE
)
`
const cartTransactionForeign = `
ALTER TABLE cartTransaction(
ADD CONSTRAINT FK_user
  FOREIGN KEY (id_user) REFERENCES users(id)
  ON DELETE CASCADE
  ON UPDATE CASCADE
)
`
exports.queryTable = [
  cartTable,
  cartTransactionTable
]

exports.queryForeign = [
  cartForeign,
  cartTransactionForeign
]
