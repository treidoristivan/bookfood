const restaurantT = `
  CREATE TABLE IF NOT EXISTS restaurant(
  id int(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  idOwner INT(11) UNSIGNED NOT NULL,
  name VARCHAR(40) NOT NULL,
  logo TEXT,
  addres TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  upated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
)
`
const restaurantF = `
  ALTER TABLE restaurant
  ADD CONSTRAINT FK_Owner
    FOREIGN KEY (idOwner) REFERENCES users(id)
    ON DELETE CASCADE
`
exports.queryTable = [
  restaurantT
]
exports.queryForeign = [
  restaurantF
]
