const getLaCrosseObservations = require('./lib/getLaCrosseObservations');
const submitToWunderground = require('./lib/submitToWunderground');

const { LA_CROSSE_DEVICE_ID, WUNDERGROUND_ID, WUNDERGROUND_PWD } = process.env;

(async function() {
  try {
    const observations = await getLaCrosseObservations(LA_CROSSE_DEVICE_ID);
    const result = await submitToWunderground(WUNDERGROUND_ID, WUNDERGROUND_PWD, observations);

    console.log(result);
  } catch (error) {
    console.error(error);
  }
})();
