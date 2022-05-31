'use strict';
require('dotenv').config();
const express = require('express');
const myDB = require('./connection');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const session = require('express-session')
const passport = require('passport')
const routes = require('./routes');
const auth = require('./auth');

const app = express();

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Tutorial 1
app.set('view engine', 'pug')

//Tutorial 3
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

//Tutorial 2
// app.route('/').get((req, res) => {
//   res.render(__dirname + '/views/pug/index', {title: 'Hello', message:'Please login'})
// });

//Tutorial 5
myDB(async client => {
  const myDataBase = await client.db('database').collection('users');

  routes(app, myDataBase);
  auth(app, myDataBase);
}).catch((e) => {
  app.route('/').get((req, res) => {
    res.render('pug', { title:e, message: 'Unable to login'})
  })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});
