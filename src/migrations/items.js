const ItemsCategories = `
  CREATE TABLE IF NOT EXISTS itemCategories(
    id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name varchar(20) NOT NULL
  )
`

const Items = `
  CREATE TABLE IF NOT EXISTS items(
  id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_restaurant INT(11) UNSIGNED NOT NULL ,
  id_category INT(11) UNSIGNED NOT NULL,
  name VARCHAR(60) NOT NULL,
  price DECIMAL(10,2) UNSIGNED NOT NULL,
  description TEXT,
  images TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
)
`
const ItemsForeign = `
  ALTER TABLE items
  ADD CONSTRAINT FK_Restaurant
    FOREIGN KEY (id_restaurant) REFERENCES restaurants(id)
    ON DELETE NO ACTION,
  ADD CONSTRAINT FK_Category
    FOREIGN KEY (id_category) REFERENCES itemCategories(id)
    ON DELETE NO ACTION
`
exports.queryTable = [
  ItemsCategories,
  Items
]
exports.queryForeign = [
  ItemsForeign
]
