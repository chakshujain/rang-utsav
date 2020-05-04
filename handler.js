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
    var params = { images: [] };
    User.findOne({ username: 'a' }, function (err, queryRes) {
        queryRes.filedata.forEach((element) => {
            // console.log(element);
            params['images'].push({
                path: element.path,
                className: element.className,
            });
        });
        // console.log(params);
        res.status(OK).render('album', params);
    });
};

handlers['/submit'] = (req, res) => {
    /* 
        get request will contain   
        filepath as key and its className (see the User.js scheme for className) as value

        update the className for each request filepath
        
    */
};

module.exports = handlers;
