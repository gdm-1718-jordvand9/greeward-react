exports.handleAPIError = function(status, msg, next) {
  const error = new Error(msg);
  error.status = status;
  return next(error);
}