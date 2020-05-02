const express = require('express');
const port = 1111;
const app = express();
const path = require('path');
const multer = require('multer');
// const serveIndex = require("serve-index");
const mongoose = require('mongoose');
const User = require('./models/User');

//Connecting mongoose
mongoose.connect('mongodb://localhost/rangutsav', { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('Connected to database');
});

//For serving static files

// app.use(
//   "/ftp",
//   express.static("public"),
//   serveIndex("public", { icons: true })
// );

// app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.urlencoded({ extended: false })); //important for fetching data from client side
app.use(express.json());

//Setting the template engine as pug
app.set('view engine', 'pug');

//Setting the views directory
app.set('views', path.join(__dirname, 'templates'));

//Upload function
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        );
    },
});
const upload = multer({ storage: storage });

// End points

app.get('/', (req, res) => {
    let params = { hey: 'hello' };
    let query = User.find({}, null);
    query.exec(function (err, users_querry) {
        if (err) res.send(err);
        params['users'] = users_querry;
        res.status(200).render('home', params);
    });
});

app.post('/indiv-user', (req, res) => {
    let params = {};
    queryid = req.body.individ;
    let query = User.findById(queryid);
    query.exec(function (err, indiv_querry) {
        if (err) res.send(err);
        params['indivuser'] = indiv_querry;
        res.status(200).render('indiv-user', params);
    });
});

app.post('/create-user', (req, res) => {
    var user = new User({
        username: req.body.username,
        hash: req.body.password,
        desc: req.body.desc,
        filedata: [],
    });
    user.save((err, user) => {
        if (err) return console.error(err);
        else res.status(200).redirect('/');
    });
});

app.post('/upload', upload.array('file', 5), (req, res) => {
    //   console.log("storage location is ", req.hostname + "/" + req.file.path);
    let query = User.findById(req.body.individ);

    query.exec(function (err, file_upload_query) {
        if (err) res.send(err);
        req.files.forEach((file) => {
            file_upload_query.filedata.push(file);
            console.log('file pushed');
        });
        file_upload_query.save((err, qry) => {
            if (err) console.error(err);
            else console.log('Successfully saved to database');
        });
        return res.status(200).send('Files Uploaded Successfully');
    });
    console.log('aaa');
});

//Starting the server
app.listen(port, () => {
    console.log(`Started server on port ${port}`);
});
