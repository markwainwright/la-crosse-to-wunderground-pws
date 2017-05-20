const laCrosseToWundergroundPws = require('./lib/la-crosse-to-wunderground-pws');

laCrosseToWundergroundPws()
  .then(console.log)
  .catch(console.error);
