var mysql = require("mysql");
    fs = require("fs");
    convert = require("xml-js");

var xml = fs.readFileSync('./dbconfig.xml', 'utf-8');
var dbInfo = convert.xml2js(xml, {compact: true, spaces: 4});

var connection = mysql.createConnection({
  host: dbInfo['dbconfig'].host['_text'],
  user: dbInfo['dbconfig'].user['_text'], // replace with the database user provided to you
  password: dbInfo['dbconfig'].password['_text'], // replace with the database password provided to you
  database: dbInfo['dbconfig'].database['_text'], // replace with the database user provided to you
  port: 3306
});

connection.connect(function(err) {
  if (err) {
    throw err;
  };
  console.log("Connected to MYSQL database!");
});

// export the connection
exports.get = function() {
  return connection;
}
