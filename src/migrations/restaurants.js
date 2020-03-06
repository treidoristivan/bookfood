const restaurants = `
  CREATE TABLE IF NOT EXISTS restaurants(
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
const restaurantsForeign = `
  ALTER TABLE restaurants
  ADD CONSTRAINT FK_Owner
    FOREIGN KEY (idOwner) REFERENCES users(id)
    ON DELETE CASCADE
`
exports.queryTable = [
  restaurants
]
exports.queryForeign = [
  restaurantsForeign
]
