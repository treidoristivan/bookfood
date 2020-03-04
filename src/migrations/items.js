const items = `(
  CREATE TABLE IF NOT EXIST items(
    id int(11) PRIMARY KEY AUTO_INCREMENT, 
    idUsers int(11) FOREIGN KEY REFERENCES users(id),
    idRestaurant int(11) FOREIGN KEY REFERENCES restaurant(id),
    idCategory int(11) FOREIGN KEY REFERENCES category(id),
    iditemsReview int(11) FOREIGN KEY REFERENCES itemsReview(id),
    name varchar(50),
    price int(10)
    description TEXT,
    images TEXT,
    dateCreated DATE,
    dateUpdated DATE
)`
module.exports = { items }
