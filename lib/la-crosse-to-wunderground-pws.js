const Pws = require('wunderground-pws');
const windrose = require('windrose');

const getJson = require('./get-json');

const { LA_CROSSE_DEVICE_ID, WUNDERGROUND_ID, WUNDERGROUND_PWD } = process.env;

const AGE_THRESHOLD = 1000 * 60 * 20; // 20 mins

function getLaCrosseObservations() {
  const url = `http://lacrossealertsmobile.com/laxservices/device_info.php?deviceid=${LA_CROSSE_DEVICE_ID}`;

  return getJson(url).then(body => {
    const observation = body.device0.obs[0];

    const age =
      new Date() -
      new Date(
        observation.utctime
          ? observation.utctime * 1000
          : parseInt(observation.TimeStamp, 10) * 1000
      );

    if (age > AGE_THRESHOLD) {
      throw new Error(`Observation from La Crosse is stale: ${age}ms`);
    }

    return observation;
  });
}

function convertToWundergroundObservations(laCrosseObservations) {
  return {
    tempf: laCrosseObservations.OutdoorTemp,
    humidity: laCrosseObservations.OutdoorHumid,
    winddir: laCrosseObservations.WindDir
      ? windrose.getDegrees(laCrosseObservations.WindDir).value
      : undefined,
    windspeedmph: laCrosseObservations.WindVelocity,
    windgustmph: laCrosseObservations.GustVelocity,
    rainin: laCrosseObservations.Rain1hr,
    dailyrainin: laCrosseObservations.Rain24hr,
    baromin: laCrosseObservations.Pressure,
    dewptf: laCrosseObservations.DewPoint,
  };
}

function submitToWunderground(wundergroundObservations) {
  return new Promise((resolve, reject) => {
    const pws = new Pws(WUNDERGROUND_ID, WUNDERGROUND_PWD);
    pws.setObservations(wundergroundObservations);
    pws.sendObservations(
      (error, status) =>
        error
          ? reject(new Error(`Wunderground error: ${error.message}`))
          : resolve({ status, observations: wundergroundObservations })
    );
  });
}

function laCrosseToWundergroundPws() {
  return getLaCrosseObservations()
    .then(convertToWundergroundObservations)
    .then(submitToWunderground);
}

module.exports = {
  // Public
  laCrosseToWundergroundPws,

  // For tests
  getLaCrosseObservations,
  convertToWundergroundObservations,
  submitToWunderground,
};
