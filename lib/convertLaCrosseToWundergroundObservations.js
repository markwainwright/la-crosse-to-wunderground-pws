const windrose = require('windrose');

module.exports = function convertLaCrosseToWundergroundObservations(laCrosseObservations) {
  return {
    tempf: laCrosseObservations.OutdoorTemp,
    humidity: parseInt(laCrosseObservations.OutdoorHumid, 10),
    winddir: laCrosseObservations.WindDir
      ? windrose.getDegrees(laCrosseObservations.WindDir).value
      : undefined,
    windspeedmph: laCrosseObservations.WindVelocity,
    windgustmph: laCrosseObservations.GustVelocity,
    rainin: laCrosseObservations.Rain1hr,
    dailyrainin: laCrosseObservations.Rain24hr,
    baromin: laCrosseObservations.Pressure,
    dewptf: laCrosseObservations.DewPoint,
    dateutc: new Date(
      laCrosseObservations.utctime
        ? laCrosseObservations.utctime * 1000
        : parseInt(laCrosseObservations.TimeStamp, 10) * 1000
    )
      .toISOString()
      .substring(0, 19)
      .replace('T', ' '),
  };
};
