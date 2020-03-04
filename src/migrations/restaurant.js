const restaurant = `
  CREATE TABLE IF NOT EXISTS restaurant(
    id int(11) PRIMARY KEY AUTO_INCREMENT, 
    name varchar(50),
    location varchar(250),
    logo varchar(250),
    dateCreated datetime,
    dateUpdated datetime
)`

module.exports = [restaurant]
