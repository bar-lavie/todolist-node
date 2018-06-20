const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Load tasks model
require("../models/Tasks");
const Task = mongoose.model("Tasks");

// Main to do list
router.get("/", (req, res) => {
  Task.find({user: req.user.id}) // find all
    .sort({ date: "desc" })
    .then(tasks => {
      res.render("mainboard", {
        tasks: tasks
      });
    });
});

// Proccess Form

// Add
router.post("/", (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({
      text: "Please add a title"
    });
  }

  if (errors.length > 0) {
    res.render("mainboard", {
      errors: errors,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    };
    new Task(newUser).save().then(Task => {
      req.flash("success_msg", "Task added");
      res.redirect("/mainboard");
    });
  }
});

// Edit

// Edit task
router.get("/edit/:id", (req, res) => {
  Task.findOne({
    _id: req.params.id
  }).then(task => {
    if(task.user != req.user.id){
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/mainboard');
    }else{      
      res.render("mainboard", {
        task: task
      });
    }
  });
});

router.put("/:id", (req, res) => {
  let errors = [];
  if (!req.body.title) {
    errors.push({
      text: "Please add a title"
    });
  }
  if (errors.length > 0) {
    res.render("mainboard", {
      errors: errors,
      details: req.body.details
    });
  } else {
    Task.findOne({
      _id: req.params.id
    }).then(task => {
      (task.title = req.body.title), (task.details = req.body.details);
      task.save().then(task => {
        req.flash("success_msg", "Task edited");
        res.redirect("/mainboard");
      });
    });
  }
});

// Delete
router.delete("/:id", (req, res) => {
  Task.remove({
    _id: req.params.id
  }).then(() => {
    req.flash("success_msg", "Task removed");
    res.redirect("/mainboard");
  });
});

module.exports = router;
