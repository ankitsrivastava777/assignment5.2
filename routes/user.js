var express = require("express");
var app = express();
const bcrypt = require("bcrypt");
var { auth } = require("../config/auth");
const { user } = require("../models/User");
var bodyParser = require("body-parser");
app.use(express.json());

app.post("/user/register", async function (req, res) {
  const salt = await bcrypt.genSalt();
  const userPassword = await bcrypt.hash(req.body.password, salt);
  if (req.body.password !== req.body.confirmpassword) {
    res.status(500).json({
      message: "password not matched",
    });
  } else {
    user.sync().then(function () {
      return user.create({
        username: req.body.username,
        lastname: req.body.lastname,
        password: userPassword,
        email: req.body.email,
      });
    });
    res.status(200).json({
      message: "user saved",
    });
  }
});
app.post("/user/login", async function (req, res) {
  username = req.body.username;
  const userDetails = await user.findOne({ where: { username: username } });
  if (userDetails === null) {
    console.log("Not found!");
  } else {
    var pass = userDetails.password;
    var userId = userDetails.id;
    var input_password = pass.toString();
    var user_password = req.body.password;
    var tokenId = userId.toString();
    if (bcrypt.compare(user_password, input_password)) {
      res.header("token", tokenId);
      res.status(200).json({ token: tokenId });
    } else {
      res.status(500).json({ message: "password not match" });
    }
  }
});

app.get("/user/get", auth, async function (req, res) {
  res.json({
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
  });
});

app.put("/user/delete/", auth, async function (req, res) {
  var user_id = req.user.id;
  console.log(user_id);
  var userDelete = user.destroy({
    where: {
      id: user_id,
    },
  });
  res.status(200).json({ message: "user deleted" });
});

app.get("/user/list/:users/:page", function (req, res) {
  pages_number = Number(req.params.page);
  if (req.params.users == 1) {
    skip_user_list = 0;
  } else {
    var skip_user_list = req.params.users * 10 - 10;
  }
  user
    .findAll({
      offset: skip_user_list,
      limit: pages_number,
    })
    .then(function (userData) {
      if (userData) {
        res.send(userData);
      } else {
        res.status(500).json({ message: "no data found" });
      }
    });
});

module.exports = app;
