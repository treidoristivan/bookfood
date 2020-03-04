const category = `
CREATE TABLE IF NOT EXISTS category(
  id int(11) PRIMARY KEY AUTO_INCREMENT, 
  name varchar(50)
)`
module.exports = [category]
