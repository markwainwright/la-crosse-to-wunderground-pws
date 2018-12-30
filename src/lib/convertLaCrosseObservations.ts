import { Observations, LaCrosseObservations } from '../types';

import {
  compassToDegrees,
  fahrenheitToCelsius,
  inchesToCentimeters,
  inHgToHPa,
  milesToKilometers,
} from './conversions';

export default function convertLaCrosseObservations(
  laCrosseObservations: LaCrosseObservations
): Observations {
  return {
    timestamp: new Date(
      (laCrosseObservations.utctime || parseInt(laCrosseObservations.TimeStamp, 10)) * 1000
    ).toISOString(),

    outdoor: {
      temperature: fahrenheitToCelsius(laCrosseObservations.OutdoorTemp),
      dewPoint: fahrenheitToCelsius(laCrosseObservations.DewPoint),
      humidity: parseInt(laCrosseObservations.OutdoorHumid, 10) / 100,
      pressure: inHgToHPa(laCrosseObservations.Pressure),
      rainDay: inchesToCentimeters(laCrosseObservations.Rain24hr),
      rainHour: inchesToCentimeters(laCrosseObservations.Rain1hr),
      rainWeek: inchesToCentimeters(laCrosseObservations.RainWeek),
      windDirection: compassToDegrees(laCrosseObservations.WindDir),
      windGust: milesToKilometers(laCrosseObservations.GustVelocity),
      windSpeed: milesToKilometers(laCrosseObservations.WindVelocity),
    },
    indoor: {
      temperature: fahrenheitToCelsius(laCrosseObservations.IndoorTemp),
      humidity: parseInt(laCrosseObservations.IndoorHumid, 10) / 100,
    },
  };
}
