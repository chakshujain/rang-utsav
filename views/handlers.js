const express = require('express');
var app = express.Router();

const userHandler = require('./user/user');
const adminHandler = require('./admin/admin');

app.get('/logout', function (req, res, next) {
    if (req.session) {
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});

app.use('/user', userHandler);
app.use('/admin', adminHandler);

app.get('/', (req, res) => {
    res.redirect('/user');
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
