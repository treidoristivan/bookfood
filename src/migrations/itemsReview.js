const itemsReview = `(
CREATE TABLE IF NOT EXIST itemsReview(
  id int(11) PRIMARY KEY AUTO_INCREMENT, 
  idUsers int(11) FOREIGN KEY REFERENCES users(id),
  idItems int(11) FOREIGN KEY REFERENCES items(id),
  rating ENUM('1','2','3','4','5', null) DEFAULT null,
  review TEXT,
  dateCreated DATE,
  dateUpdated DATE
  )`

module.exports = { itemsReview }
