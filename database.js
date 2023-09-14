const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'sakila',
  password: 'password'
});

module.exports = pool.promise();

// https://stackoverflow.com/questions/37102364/how-do-i-create-a-mysql-connection-pool-while-working-with-nodejs-and-express