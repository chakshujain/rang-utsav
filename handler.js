const mongoose = require('mongoose');
const User = require('./models/User');
const OK = 200;
mongoose.connect('mongodb://localhost/rangutsav', { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to database');
});

var handlers = {};

handlers['/album'] = (req, res) => {
    let params = {};
    params['pageTitle'] = 'Welcome to Albums';
    res.status(OK).render('album', params);
};

handlers['/images'] = (req, res) => {
    var params = { images: [], hey: 'hello' };
    User.findOne({ username: 'a' }, function (err, queryRes) {
        queryRes.filedata.forEach((element) => {
            // console.log(element);
            params['images'].push(element.path);
        });
        res.status(OK).render('images', params);
    });
};

module.exports = handlers;
