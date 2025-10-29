const faker = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("viewengine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.listen("8080", () => {
  console.log("app is listening at port 8080");
});

// Homepage Route
app.get("/", (req, res) => {
  let q = "SELECT COUNT(*) FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["COUNT(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
});

// Show all Users Route
app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";

  try {
    connection.query(q, (err, users) => {
      if (err) throw err;
      res.render("showusers.ejs", { users });
    });
  } catch (err) {
    console.log(err);
    res.send("Some Error in DB");
  }
});

//Edit Route
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id ='${id}' `;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
    console.log("Some error with DB");
  }
});

//Update Route
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password: formPass, username: newUsername } = req.body;
  let q = `SELECT * FROM user WHERE id ='${id}' `;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (formPass != user.password) {
        res.send("incorrect Password");
      } else {
        let q2 = `UPDATE user SET username='${newUsername}' WHERE id ='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          res.redirect("/user");
        });
      }
    });
  } catch (err) {
    console.log(err);
    console.log("Some error with DB");
  }
});

// new user Route
app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/user/new", (req, res) => {
  let { username, email, password } = req.body;
  let id = uuidv4();

  let q = `INSERT INTO user (id,username,email,password) VALUE ('${id}','${username}','${email}','${password}')`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log("added");
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
    console.log("Some error with DB");
  }
});

//Delete Route
app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT *FROM user WHERE id ='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    res.send("some issue with DB");
  }
});

app.delete("/user/:id/", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      if (user.password != password) {
        res.send("wrong password");
      } else {
        let q2 = `DELETE FROM user WHERE id ='${id}'`;
        connection.query(q2, (err, result) => {
          if (err) throw err;
          else {
            res.redirect("/user");
          }
        });
      }
    });
  } catch (err) {
    res.send("some issue with DB");
  }
});
// Connection with SQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "usama_app",
  password: "Usama@0498",
});

// let getRandomUser = () => {
//   return [
//     faker.string.uuid(),
//     faker.internet.username(),
//     faker.internet.email(),
//     faker.internet.password(),
//   ];
// };

// connection.end();

// let data = [];
// for (let i = 1; i <= 100; i++) {
//   data.push(getRandomUser());
// }
