import {
  celsiusToFahrenheit,
  metersPerSecondToMilesPerHour,
  millimetersToInches,
  hPaToInHg,
} from './conversions';
import { Observation, WundergroundObservation } from './types';

export default function convertToWundergroundObservation(
  observation: Observation
): WundergroundObservation {
  // See https://support.weather.com/s/article/PWS-Upload-Protocol
  return {
    dateutc: observation.timestamp.substring(0, 19).replace('T', ' '),

    ...(observation.temperature !== null
      ? { tempf: celsiusToFahrenheit(observation.temperature) }
      : {}),
    ...(observation.dewPoint !== null ? { dewptf: celsiusToFahrenheit(observation.dewPoint) } : {}),
    ...(observation.humidity !== null ? { humidity: observation.humidity * 100 } : {}),

    ...(observation.pressure !== null ? { baromin: hPaToInHg(observation.pressure) } : {}),

    ...(observation.rain
      ? {
          rainin: millimetersToInches(observation.rain.hour),
          dailyrainin: millimetersToInches(observation.rain.day),
        }
      : {}),

    ...(observation.wind
      ? {
          winddir: observation.wind.direction,
          windspeedmph: metersPerSecondToMilesPerHour(observation.wind.speed),
          windgustmph: metersPerSecondToMilesPerHour(observation.wind.gust),
        }
      : {}),
  };
}
