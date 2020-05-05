const express = require("express");
var app = express.Router();

const userHandler = require("./user/user");
const adminHandler = require("./admin/admin");

app.get("/logout", function(req, res, next) {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/admin/login");
      }
    });
  }
});

app.use("/user", userHandler);
app.use("/admin", adminHandler);

app.get("/", (req, res) => {
  res.redirect("/user");
});
const User = require("./../models/User");
var userData = {
  username: "admin",
  password: "admin",
  desc: "Sample Description",
  filedata: [],
  isSuperUser: true,
};
User.create(userData, function(error, user) {});

// Starting the server

module.exports = app;
