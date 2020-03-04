var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const authenticate = require('./authenticate');
const config = require('./config');
const uploadRouter = require('./routes/uploadRouter');


const session = require('express-session');
const FileStore = require('session-file-store')(session);

const campsiteRouter = require('./routes/campsiteRouter');
const promotionsRouter = require('./routes/promotionsRouter');
const partnerRouter = require('./routes/partnerRouter');

const mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'), 
    err => console.log(err)
);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionsRouter);
app.use('/partners', partnerRouter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321'));

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/imageUpload', uploadRouter);


function auth(req, res, next) {
  console.log(req.user);

  if (!req.user) {
      const err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');                       
      err.status = 403;
      return next(err);
  } else {
      return next();
  }
}

// Secure traffic only
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
      console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
      res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
});

app.use(auth); 

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
