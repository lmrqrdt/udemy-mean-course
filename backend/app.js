const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const MongoClient = require('mongodb').MongoClient;

const app = express();

// mongodb pw PG1xaX01RTJbKSUX
mongoose.connect(
  'mongodb+srv://larry:' +
    process.env.MONGO_ATLAS_PW +
    '@cluster0-ed9jk.mongodb.net/mean-course-db', {useNewUrlParser: true})
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
app.use('/api/user', userRoutes);

module.exports = app;
