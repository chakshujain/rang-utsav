const express = require('express');
const port = 1111;
const app = express();
const path = require('path');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const db = require('./views/util/db_connect');
const handlers = require('./views/handlers');

app.use(
    session({
        secret: 'work hard',
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: db,
        }),
    })
);

app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: false })); //important for fetching data from client side
app.use(express.json());

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'templates'));

app.use(handlers);

app.listen(port, () => {
    console.log(`Started server on port ${port}`);
});
