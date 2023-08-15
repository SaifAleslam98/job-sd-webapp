var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser'); 
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const routesHandle = require('./routes/routerHandler');
const dbConnection = require('./config/database');
const expressHbs = require('express-handlebars');
const expressSession = require('express-session');
const appError = require('./utils/appError');
const globalError = require('./middlewares/errorMiddleware');
const flash = require('connect-flash');
const passport = require('passport');
var app = express();
dbConnection();
require('./config/passport');
// view engine setup
app.engine('.hbs', expressHbs.engine({
  defaultLayout: 'layout', extname: '.hbs'
}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession({ secret: 'Dokank', saveUninitialized: false, resave: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

routesHandle(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
app.all('*', (req, res, next) => {

  next(new appError(`Cant found this route :${req.originalUrl}`, 400))
})

// error handler
app.use(globalError);

module.exports = app;
