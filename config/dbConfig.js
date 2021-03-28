const mysql = require("promise-mysql");

const dbConfig = {
  host: "kimdongjun.clpoyguhtsh4.ap-northeast-2.rds.amazonaws.com",
  port: 3306,
  user: "DONGJUN",
  password: "dongjun125",
  database: "myside"
};

module.exports = mysql.createPool(dbConfig);