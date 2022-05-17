module.exports.sendResponse = function (result, message) {
  var response = {};
  response = {
    success: true,
    message: message,
    data: result,
  };
  return response;
};
module.exports.sendError = function (error, errorMessages = []) {
  {
    var response = {};
    response = {
      success: false,
      message: errorMessages,
      data: error,
    };
    return response;
  }
};
