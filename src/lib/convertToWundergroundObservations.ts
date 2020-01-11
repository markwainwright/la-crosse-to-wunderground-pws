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
  return {
    tempf: celsiusToFahrenheit(observations.outdoor.temperature),
    humidity: observations.outdoor.humidity * 100,
    winddir: observations.outdoor.windDirection,
    windspeedmph: kilometersToMiles(observations.outdoor.windSpeed),
    windgustmph: kilometersToMiles(observations.outdoor.windGust),
    rainin: millimetersToInches(observations.outdoor.rainHour),
    dailyrainin: millimetersToInches(observations.outdoor.rainDay),
    baromin: hPaToInHg(observations.outdoor.pressure),
    dewptf: celsiusToFahrenheit(observations.outdoor.dewPoint),
    dateutc: observations.timestamp.substring(0, 19).replace('T', ' '),
  };
}
