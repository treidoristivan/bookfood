const itemsReview = `
CREATE TABLE IF NOT EXISTS itemsReview(
  id int(11) PRIMARY KEY AUTO_INCREMENT, 
  idUsers int(11),
  idItems int(11),
  rating ENUM('1','2','3','4','5', 'null') DEFAULT 'null',
  review varchar(250),
  dateCreated datetime,
  dateUpdated datetime
  )`

module.exports = [itemsReview]
