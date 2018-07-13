const get = require('./get');

module.exports = async function submitToWunderground(
  stationId,
  password,
  wundergroundObservations
) {
  // See http://wiki.wunderground.com/index.php/PWS_-_Upload_Protocol
  const params = {
    dateutc: 'now',
    ...wundergroundObservations,
    action: 'updateraw',
    ID: stationId,
    PASSWORD: password,
  };

  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  const body = await get({
    host: 'weatherstation.wunderground.com',
    path: `/weatherstation/updateweatherstation.php?${queryString}`,
  });

  if (body.trim() === 'success') {
    return {
      stationId,
      observations: wundergroundObservations,
    };
  } else {
    throw new Error(`Unknown Wunderground response: ${body}`);
  }
};
