const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');

const MongoClient = require('mongodb').MongoClient;

const app = express();

// mongodb pw PG1xaX01RTJbKSUX
mongoose.connect('mongodb+srv://larry:PG1xaX01RTJbKSUX@cluster0-ed9jk.mongodb.net/mean-course-db?retryWrites=true', {useNewUrlParser: true})
 .then (() => {
    console.log('Connected to database!')
  }).catch(() => {
    console.log('Connection to database failed!');
  });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));

app.use('/api/posts', postsRoutes);

module.exports = app;
