let mysql = require('mysql');

exports.pool  = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'wenping',
  password : 'Password1',
  database : 'wenping'
});
