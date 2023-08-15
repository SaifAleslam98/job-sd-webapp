const AppError = require("../utils/appError");

const handleJwtInvalidSignature = () =>
  new AppError('Invalid Token, please login again', 401);
const handleJwtExpired = () =>
  new AppError('Expired token, please login again..', 401);

const sendErrorForDev = (err, res) => res.status(err.statusCode).json({
  status: err.status,
  error: err,
  message: err.message,
  stack: err.stack
});

const sendErrorForProd = (err, res) => res.status(err.statusCode).render('error',{
    status: err.status,
    message: err.message,
  })
const globalError = (err, req, res, next) => {
  // set locals, only providing error in development
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    if (err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
    if (err.name === 'TokenExpiredError') err = handleJwtExpired(err);
    sendErrorForDev(err, res);
  } else {

    sendErrorForProd(err, res);
  }
};
module.exports = globalError;