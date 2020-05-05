const express = require('express');
var app = express.Router();

const userHandler = require('./user/user');
const adminHandler = require('./admin/admin');

app.use('/user', userHandler);
app.use('/admin', adminHandler);

app.get('/', (req, res) => {
    res.status(200).render('index');
});

// var userData = {
//   username: "admin",
//   password: "admin",
//   desc: "adssad",
//   filedata: [],
//   isSuperUser: true,
// };
// User.create(userData, function(error, user) {});

//Starting the server

module.exports = app;
