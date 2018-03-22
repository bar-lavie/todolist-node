const express = require('express');
const exphbs = require('express-handlebars')
var bodyParser = require('body-parser')
const mongoose = require('mongoose');

const app = express();

// Connect to mongoose
mongoose.connect('mongodb://localhost/todolix')
    .then(() => console.log('MongoDB connected...'))
    .catch(() => console.log(err));

// Load idea model
require('./models/Tasks');
const Task = mongoose.model('Tasks');


// Handle-bars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

// Routes
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    })
});

app.get('/about', (req, res) => {
    res.render('about')
});

// Main to do list
app.get('/mainboard', (req, res) => {
    res.render('mainboard')
});

// Proccess Form
app.post('/mainboard', (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({
            text: 'Please add a title'
        })
    }

    if (errors.length > 0) {
        res.render('mainboard', {
            errors: errors,
            details: req.body.details
        })
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
        }
        new Task(newUser)
        .save()
        .then(Task=>{
            res.redirect('/mainboard');
        })
    }
});

app.listen(5000, () => {
    console.log(`server started on port 5000`);
});