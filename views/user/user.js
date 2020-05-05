const express = require('express');
const router = express.Router();
const User = require('./../../models/User');

const baseUrl = '/user/';
const baseTemplatePath = 'user/';

router.get('/login', function (request, response) {
    response.render(baseTemplatePath + 'login', {
        pageTitle: 'User Login',
    });
});

router.post('/login', function (req, res) {
    if (req.body.logusername && req.body.logpassword) {
        User.authenticate(req.body.logusername, req.body.logpassword, function (
            error,
            user
        ) {
            if (error || !user) {
                res.send(error);
            } else {
                req.session.userId = user._id;
                res.redirect(baseUrl);
            }
        });
    } else {
        res.redirect(baseUrl + 'login');
    }
});

router.use('/', function (request, response, next) {
    if (!request.session.userId) {
        response.redirect(baseUrl + 'login');
    } else next();
});

router.get('/', (req, res) => {
    var params = { images: [], pageTitle: 'Album Images' };
    User.findById(req.session.userId, function (err, queryRes) {
        queryRes.filedata.forEach((element) => {
            // console.log(element);
            params['images'].push({
                path: element.path,
                className: element.className,
                name: element.filename,
            });
        });
        // console.log(params);
        res.status(200).render(baseTemplatePath + 'index', params);
    });
});

router.post('/submit', (req, res) => {
    User.findById(req.session.userId, function (err, userObj) {
        userObj.filedata.forEach(function (element) {
            if (req.body[element.filename]) {
                element.className = 'selected';
                console.log(element.className);
            } else {
                element.className = '';
            }
        });
        userObj.save(function (err) {
            console.log('err', err);
        });
        res.status(200).send('done');
    });
});

module.exports = router;
