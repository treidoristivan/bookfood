const categoryT = `
  CREATE TABLE IF NOT EXISTS itemCategories(
    id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name varchar(20) NOT NULL
  )
`

const itemsT = `
  CREATE TABLE IF NOT EXISTS items(
  id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  idRestaurant INT(11) UNSIGNED NOT NULL ,
  idCategory INT(11) UNSIGNED DEFAULT 0,
  name VARCHAR(60) NOT NULL,
  price DECIMAL(10,2) UNSIGNED NOT NULL,
  quantity INT(11) UNSIGNED DEFAULT 0,
  description TEXT,
  images TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
)
`
const itemReviewsT = `
  CREATE TABLE IF NOT EXISTS itemReviews(
    id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    idUser INT(11) UNSIGNED DEFAULT 0 ,
    idItem INT(11) UNSIGNED DEFAULT 0,
    rating TINYINT(1) UNSIGNED DEFAULT 0,
    review TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
  )
`
const itemF = `
  ALTER TABLE items
  ADD CONSTRAINT FK_Restaurant
    FOREIGN KEY (idRestaurant) REFERENCES restaurant(id)
    ON DELETE CASCADE,
  ADD CONSTRAINT FK_Category
    FOREIGN KEY (idCategory) REFERENCES itemCategories(id)
    ON DELETE SET NULL
`
const itemReviewsF = `
  ALTER TABLE itemReviews
  ADD CONSTRAINT FK_User_Review
    FOREIGN KEY (idUser) REFERENCES users(id)
    ON DELETE SET NULL,
  ADD CONSTRAINT FK_Item_Review
    FOREIGN KEY (idItem) REFERENCES items(id)
    ON DELETE SET NULL
`
exports.queryTable = [
  categoryT,
  itemsT,
  itemReviewsT
]
exports.queryForeign = [
  itemF,
  itemReviewsF
]
