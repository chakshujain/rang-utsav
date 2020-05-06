const express = require("express");
var app = express.Router();

const userHandler = require("./user/user");
const adminHandler = require("./admin/admin");

const baseUrl = "/";
const baseTemplatePath = "";
app.get("/login", function(request, response) {
  if (request.session.userId) response.redirect("/");
  else
    response.render(baseTemplatePath + "login", {
      pageTitle: "Admin Login",
    });
});

app.post("/login", function(req, res) {
  if (req.body.logusername && req.body.logpassword) {
    User.authenticate(req.body.logusername, req.body.logpassword, function(
      error,
      user
    ) {
      if (error || !user) {
        res.render(baseTemplatePath + "login", {
          pageTitle: "Admin Login",
          errorMsg: "Invalid username or password",
        });
      } else {
        req.session.userId = user._id;
        res.redirect(baseUrl + "admin");
      }
    });
  } else {
    res.render(baseTemplatePath + "login", {
      pageTitle: "Admin Login",
      errorMsg: "Your password or username may be wrong",
    });
  }
});

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
  res.redirect("/admin");
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
