import { getDegrees } from 'windrose';

import { LaCrosseObservations, WundergroundObservations } from '../types';

export default function convertLaCrosseToWundergroundObservations(
  laCrosseObservations: LaCrosseObservations
): WundergroundObservations {
  const windDirectionDegrees = laCrosseObservations.WindDir
    ? getDegrees(laCrosseObservations.WindDir)
    : undefined;

  return {
    tempf: laCrosseObservations.OutdoorTemp,
    humidity: parseInt(laCrosseObservations.OutdoorHumid, 10),
    winddir: windDirectionDegrees ? windDirectionDegrees.value : undefined,
    windspeedmph: laCrosseObservations.WindVelocity,
    windgustmph: laCrosseObservations.GustVelocity,
    rainin: laCrosseObservations.Rain1hr,
    dailyrainin: laCrosseObservations.Rain24hr,
    baromin: laCrosseObservations.Pressure,
    dewptf: laCrosseObservations.DewPoint,
    dateutc: new Date(
      (laCrosseObservations.utctime || parseInt(laCrosseObservations.TimeStamp, 10)) * 1000
    )
      .toISOString()
      .substring(0, 19)
      .replace('T', ' '),
  };
}
