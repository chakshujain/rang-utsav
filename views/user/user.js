const express = require('express');
const router = express.Router();
const User = require('./../../models/User');

const baseUrl = '/user/';
const baseTemplatePath = 'user/';

router.get('/login', function (request, response) {
    response.render('user/login');
});

router.use('/', function (request, response, next) {
    if (!request.session.userId) {
        response.redirect('/user/login');
    } else next();
});

module.exports = router;
