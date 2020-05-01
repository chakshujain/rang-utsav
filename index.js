const express = require("express");
const port = 1111;
const app = express();
const path = require("path");
const multer = require("multer");
const serveIndex = require("serve-index");
const mongoose = require("mongoose");
const User = require("./models/User");

//Connecting mongoose
mongoose.connect("mongodb://localhost/rangutsav", { useNewUrlParser: true });

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  // we're connected!
  console.log("Connected to database");
});

//For serving static files
app.use(
  "/ftp",
  express.static("public"),
  serveIndex("public", { icons: true })
);
app.use(express.urlencoded({ extended: false })); //important for fetching data from client side
app.use(express.json());

//Setting the template engine as pug
app.set("view engine", "pug");

//Setting the views directory
app.set("views", path.join(__dirname, "templates"));

//Upload function
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });

// End points
app.get("/", (req, res) => {
  res.status(200).render("home");
});
app.post("/create-user", (req, res) => {
  var user1 = new User({
    username: "chks",
    hash: "abcdef",
    desc: "this is desc",
    filepaths: {
      "1": "abc/defe",
    },
  });
  user1.save((err, user1) => {
    if (err) return console.error(err);
    else res.status(200).send(`${user1.username} created successfully`);
  });
});
app.get("/upload", (req, res) => {
  res.status(200).render("index");
});

app.post("/upload", upload.array("file", 5), (req, res) => {
  //   console.log("storage location is ", req.hostname + "/" + req.file.path);
  return res.send(req.file);
});

//Starting the server
app.listen(port, () => {
  console.log(`Started server on port ${port}`);
});
