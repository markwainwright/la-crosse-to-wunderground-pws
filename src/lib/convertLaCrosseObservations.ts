import { Observations, LaCrosseObservations } from './types';

import {
  compassToDegrees,
  fahrenheitToCelsius,
  inchesToMillimeters,
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
      rainDay: inchesToMillimeters(laCrosseObservations.Rain24hr),
      rainHour: inchesToMillimeters(laCrosseObservations.Rain1hr),
      rainWeek: inchesToMillimeters(laCrosseObservations.RainWeek),
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
