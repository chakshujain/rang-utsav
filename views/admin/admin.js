const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const upload = require('../util/upload');

const baseUrl = '/admin/';
const baseTemplatePath = 'admin/';

router.get('/login', function (request, response) {
    response.render(baseTemplatePath + 'login', {
        pageTitle: 'Admin Login',
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

/* 
    Middleware for checking wether user is authenticated for 
    current page if not redirect to log page 
*/
router.use(function (request, response, next) {
    if (!request.session.userId) {
        response.redirect(baseUrl + 'login');
    } else {
        var q = User.findById(request.session.userId);
        q.exec(function (err, res) {
            if (err || !res.isSuperUser) response.redirect(baseUrl + 'login');
            else next();
        });
    }
});

router.get('/', function (request, response) {
    let params = {};
    params['pageTitle'] = 'Welcome';
    let query = User.find({}, null);
    query.exec(function (err, users_querry) {
        if (err) response.send(err);
        params['users'] = users_querry;
        response.status(200).render(baseTemplatePath + 'index', params);
    });
});

router.post('/new-user', function (req, res) {
    if (req.body.username && req.body.password) {
        var userData = {
            username: req.body.username,
            password: req.body.password,
            desc: req.body.desc,
            filedata: [],
        };
        if (req.body.superuser) {
            userData.isSuperUser = true;
        }
        user = new User(userData);
        user.save((err, user) => {
            if (err) {
                res.send(err);
            } else {
                return res.redirect(baseUrl);
            }
        });
    }
});

router.get('/manage', function (req, res) {
    var userName = req.query.user;
    User.findOne({ username: userName }, function (err, qRes) {
        if (qRes != null) {
            res.render(baseTemplatePath + 'manage', {
                username: userName,
                pageTitle: 'Manage Users',
            });
        }
    });
});

router.get('/logout', function (req, res, next) {
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

router.post('/upload', upload.array('file', 100), function (req, res) {
    let query = User.findOne({ username: req.body.individ });
    file_uploaded = false;
    query.exec(function (err, file_upload_query) {
        if (err) res.send(err);
        req.files.forEach((file) => {
            file_upload_query.filedata.push(file);
            console.log('file pushed');
        });
        file_upload_query.save((err, qry) => {
            if (err) res.send(err);
            console.log('Successfully saved to database');
            queryid = req.body.individ;
            file_uploaded = true;
            return res.status(200).redirect(baseUrl);
        });
    });
});

module.exports = router;
