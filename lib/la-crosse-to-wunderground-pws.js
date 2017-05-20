const http = require('http');
const Pws = require('wunderground-pws');
const windrose = require('windrose');

const { LA_CROSSE_DEVICE_ID, WUNDERGROUND_ID, WUNDERGROUND_PWD } = process.env;

function getJson (url) {
  return new Promise((resolve, reject) => {
    http.get(url, response => {
      if (response.statusCode >= 300 || response.statusCode < 200) {
        response.resume();
        return reject(new Error(`${response.statusCode} ${response.statusMessage}`));
      }

      const body = [];
      response.setEncoding('utf8')
        .on('data', chunk => body.push(chunk))
        .on('end', () => resolve(body.join('')));
    })
    .on('error', reject);
  })
  .then(JSON.parse);
}

function getLaCrosseObservations () {
  return getJson(`http://lacrossealertsmobile.com/laxservices/device_info.php?deviceid=${LA_CROSSE_DEVICE_ID}`)
    .then(body => body.device0.obs[0]);
}

function convertToWundergroundObservations (laCrosseObservations) {
  return {
    tempf: laCrosseObservations.OutdoorTemp,
    humidity: laCrosseObservations.OutdoorHumid,
    winddir: windrose.getDegrees(laCrosseObservations.WindDir).value,
    windspeedmph: laCrosseObservations.WindVelocity,
    windgustmph: laCrosseObservations.GustVelocity,
    rainin: laCrosseObservations.Rain1hr,
    dailyrainin: laCrosseObservations.Rain24hr,
    baromin: laCrosseObservations.Pressure,
    dewptf: laCrosseObservations.DewPoint,
  };
}

function submitToWunderground (wundergroundObservations) {
  return new Promise((resolve, reject) => {
    const pws = new Pws(WUNDERGROUND_ID, WUNDERGROUND_PWD);
    pws.setObservations(wundergroundObservations);
    pws.sendObservations((error, status) =>
      error ? reject(error) : resolve({status, observations: wundergroundObservations}));
  });
}

module.exports = function laCrosseToWundergroundPws() {
  return getLaCrosseObservations()
    .then(convertToWundergroundObservations)
    .then(submitToWunderground);
};
