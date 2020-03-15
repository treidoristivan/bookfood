const categoryT = `
  CREATE TABLE IF NOT EXISTS itemCategories(
    _id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name varchar(20) NOT NULL
  )
`

const itemsT = `
  CREATE TABLE IF NOT EXISTS items(
  _id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_restaurant INT(11) UNSIGNED NOT NULL ,
  id_category INT(11) UNSIGNED DEFAULT 0,
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
    _id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_user INT(11) UNSIGNED DEFAULT 0 ,
    id_item INT(11) UNSIGNED DEFAULT 0,
    rating TINYINT(1) UNSIGNED DEFAULT 0,
    review TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
  )
`
const itemF = `
  ALTER TABLE items
  DROP CONSTRAINT IF EXISTS FK_Restaurant,
  DROP CONSTRAINT IF EXISTS FK_Category;
  ALTER TABLE items
  ADD CONSTRAINT FK_Restaurant
    FOREIGN KEY (id_restaurant) REFERENCES restaurants(_id)
    ON DELETE CASCADE,
  ADD CONSTRAINT FK_Category
    FOREIGN KEY (id_category) REFERENCES itemCategories(_id)
    ON DELETE SET NULL
`
const itemReviewsF = `
  ALTER TABLE itemReviews
  DROP CONSTRAINT IF EXISTS FK_User_Review,
  DROP CONSTRAINT IF EXISTS FK_Item_Review;
  ALTER TABLE itemReviews
  ADD CONSTRAINT FK_User_Review
    FOREIGN KEY (id_user) REFERENCES users(_id)
    ON DELETE SET NULL,
  ADD CONSTRAINT FK_Item_Review
    FOREIGN KEY (id_item) REFERENCES items(_id)
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
