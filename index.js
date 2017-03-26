const redis = require('ioredis');

module.exports = function apiUsageRate() {
  return (req, res, next) => {
    // TODO: check ECahrts API doc to make proper way to add real-time data into charts in front-end page.
    // * Maybe redis message queue can be used
    next();
  };
};
