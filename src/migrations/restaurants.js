const restaurantsT = `
  CREATE TABLE IF NOT EXISTS restaurants(
  _id int(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_owner INT(11) UNSIGNED NOT NULL,
  name VARCHAR(40) NOT NULL,
  logo TEXT,
  address TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  upated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
)
`
const restaurantsF = `
  ALTER TABLE restaurants
  DROP CONSTRAINT IF EXISTS FK_Owner;
  ALTER TABLE restaurants
  ADD CONSTRAINT FK_Owner
    FOREIGN KEY (id_owner) REFERENCES users(_id)
    ON DELETE CASCADE
`
exports.queryTable = [
  restaurantsT
]
exports.queryForeign = [
  restaurantsF
]
