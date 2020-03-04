const restaurant = `(
  CREATE TABLE IF NOT EXIST restaurant(
    id int(11) PRIMARY KEY AUTO_INCREMENT, 
    name varchar(50),
    location TEXT,
    logo TEXT,
    dateCreated DATE,
    dateUpdated DATE
)`

module.exports = { restaurant }
