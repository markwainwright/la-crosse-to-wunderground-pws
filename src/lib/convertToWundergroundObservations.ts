import {
  celsiusToFahrenheit,
  kilometersToMiles,
  millimetersToInches,
  hPaToInHg,
} from './conversions';
import { Observations, WundergroundObservations } from './types';

export default function convertLaCrosseToWundergroundObservations(
  observations: Observations
): WundergroundObservations {
  // See https://support.weather.com/s/article/PWS-Upload-Protocol
  return {
    dateutc: observations.timestamp.substring(0, 19).replace('T', ' '),

    ...(observations.temperature !== null
      ? { tempf: celsiusToFahrenheit(observations.temperature) }
      : {}),
    ...(observations.dewPoint !== null
      ? { dewptf: celsiusToFahrenheit(observations.dewPoint) }
      : {}),
    ...(observations.humidity !== null ? { humidity: observations.humidity * 100 } : {}),

    ...(observations.pressure !== null ? { baromin: hPaToInHg(observations.pressure) } : {}),

    ...(observations.rain
      ? {
          rainin: millimetersToInches(observations.rain.hour),
          dailyrainin: millimetersToInches(observations.rain.day),
        }
      : {}),

    ...(observations.wind
      ? {
          winddir: observations.wind.direction,
          windspeedmph: kilometersToMiles(observations.wind.speed),
          windgustmph: kilometersToMiles(observations.wind.gust),
        }
      : {}),
  };
}
