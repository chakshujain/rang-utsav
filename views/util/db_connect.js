const mongoose = require('mongoose');

//Connecting mongoose
mongoose.connect('mongodb://localhost/rangutsav', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log('Connected to database');
});

module.exports = db;
