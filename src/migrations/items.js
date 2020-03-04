const items = `
  CREATE TABLE IF NOT EXISTS items(
    id int(11) PRIMARY KEY AUTO_INCREMENT, 
    idUsers int(11),
    idRestaurant int(11),
    idCategory int(11),
    iditemsReview int(11),
    name varchar(50),
    price int(10),
    description varchar(250),
    images varchar(250),
    dateCreated datetime,
    dateUpdated datetime
)`
module.exports = [items]
