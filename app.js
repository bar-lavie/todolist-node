const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");

const app = express();

// Load routes
const tasks = require('./routes/tasks');
const users = require('./routes/users');

// Connect to mongoose
mongoose
  .connect("mongodb://localhost/todolix")
  .then(() => console.log("MongoDB connected..."))
  .catch(() => console.log(err));


// *********************************
// ********* Middlewares
// *********************************
// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");
// Body parser
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
// Method Override
app.use(methodOverride("_method"));
// Flash
app.use(flash());

// Session
app.use(
  session({
    secret: "todolixisawesome",
    resave: true,
    saveUninitialized: true
  }));
// Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// App set for public folder 
app.use(express.static(path.join(__dirname, 'public')));

// *********************************
// ********* Routes
// *********************************

// Routes middleware
const {ensureAuthenticated} = require('./helpers/auth');


app.get("/", ensureAuthenticated, (req, res) => {
  const title = "Welcome";
  res.render("index", {
    title: title
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.use('/mainboard',ensureAuthenticated, tasks)

app.use('/users', users)

// Passport congig
require('./config/passport')(passport)

app.listen(5000, () => {
  console.log(`server started on port 5000`);
});
