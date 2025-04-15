const mysql = require('mysql2/promise');

const con = mysql.createPool({
  waitForConnections: true,
  connectionLimit: 10,
  idleTimeout: 60000,
  host: process.env.MySQL_host,
  user: process.env.MySQL_user,
  password: process.env.MySQL_pass,
  port: process.env.MySQL_port,
  database: process.env.MySQL_db,
  multipleStatements: true,
});

con.getConnection((error) => {
  if (error) {
    console.log(`there is an error bro!${error}`);
  } else {
    console.log('connected to database 🖥️');
  }
});

module.exports = con;