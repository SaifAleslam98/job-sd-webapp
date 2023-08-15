var indexRouter = require('./index');
var usersRouter = require('./users');
var authRouter = require('./authenticate');

const routesHandle = (app) => {
    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/auth', authRouter);
}
module.exports = routesHandle;