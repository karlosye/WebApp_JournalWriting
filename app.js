// Setting up all the required package
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { application } = require("express");

const _ = require('lodash');

const app = express();

// Setting up the EJS engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

/********** Set up MongoDB database ************/
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/BlogDB');

//Create a new schema
const blogsSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Blog = mongoose.model("Blog", blogsSchema);
/***********************************************/

const homeStartingContent = "Hi there!! This is a small web application for writing daily journals. This web application is created by Karlos Ye, with the use of Node.js, Express.js, EJS and MongoDB.";
const contactContent = "Contact me at 123@gmail.com";


// Setting up all the app.routes:
app.get('/', function (req, res) {

  Blog.find({}, function (err, foundBlogs) {
    if (!err) {
      res.render('home', {
        homeStartingContent: homeStartingContent,
        posts: foundBlogs
      });

    }
  })
});


app.get('/about', function (req, res) {
  res.render('about')
});

app.get('/contact', function (req, res) {
  res.render('contact', { contactContent: contactContent })
});

app.get('/compose', function (req, res) {
  res.render('compose')
});


app.get('/posts/:requestPostID', function (req, res) {

  let requestPostID = req.params.requestPostID;
  Blog.findById(requestPostID, function (err, foundBlog) {
    if (!err) {
      res.render("post", {
        requestedTitle: foundBlog.title,
        requestedContent: foundBlog.content
      })
    };
  });
});

app.post('/compose', function (req, res) {

  const item = new Blog({
    title: req.body.journalInputTitle,
    content: req.body.journalInputContent
  });
  item.save(function (err) {
    if (!err) {
      res.redirect('/');
    }
  });
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
