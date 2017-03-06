const express         = require('express');
const path            = require('path');
const logger          = require('morgan');
const cookieParser    = require('cookie-parser');
const bodyParser      = require('body-parser');
const cors            = require('cors')
const config          = require('config')
const mongoose        = require('mongoose')
const passport        = require('passport')
const passport_jwt    = require('passport-jwt')
var cookieSession     = require('cookie-session');



var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

mongoose.connect(config.db)
mongoose.connection.on('connected', () => {
  console.log('Let\'s role!')
})
mongoose.connection.on('error', (error) => {
  console.log('Something worng!!', error)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Passport
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

// Sessions
app.use(cookieSession({
  name: 'session',
  keys: ['icEgv95GyU', 'r5oQr21nj5'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
