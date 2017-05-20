const laCrosseToWundergroundPws = require('./lib/la-crosse-to-wunderground-pws');

exports.handler = function(event, context, callback) {
  laCrosseToWundergroundPws()
    .then(result => {
      console.log(result);
      callback(null, result);
    })
    .catch(callback);
};
