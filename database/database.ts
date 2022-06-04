import mysql from "mysql";

var db = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword",
});

db.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

export default db