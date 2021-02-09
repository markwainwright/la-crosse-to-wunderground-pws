import { Observations, LaCrosseObservations } from './types';

import {
  compassToDegrees,
  fahrenheitToCelsius,
  inchesToMillimeters,
  inHgToHPa,
  milesToKilometers,
} from './conversions';

const THERMO_HYGRO_ENABLED = process.env.THERMO_HYGRO_ENABLED === '1';
const PRESSURE_ENABLED = process.env.PRESSURE_ENABLED === '1';
const RAIN_ENABLED = process.env.RAIN_ENABLED === '1';
const WIND_ENABLED = process.env.WIND_ENABLED === '1';
const INDOOR_THERMO_HYGRO_ENABLED = process.env.INDOOR_THERMO_HYGRO_ENABLED === '1';

export default function convertLaCrosseObservations(
  laCrosseObservations: LaCrosseObservations
): Observations {
  return {
    timestamp: new Date(
      (laCrosseObservations.utctime || parseInt(laCrosseObservations.TimeStamp, 10)) * 1000
    ).toISOString(),

    temperature: THERMO_HYGRO_ENABLED
      ? fahrenheitToCelsius(laCrosseObservations.OutdoorTemp)
      : null,
    dewPoint: THERMO_HYGRO_ENABLED ? fahrenheitToCelsius(laCrosseObservations.DewPoint) : null,
    humidity: THERMO_HYGRO_ENABLED ? parseInt(laCrosseObservations.OutdoorHumid, 10) / 100 : null,

    pressure: PRESSURE_ENABLED ? inHgToHPa(laCrosseObservations.Pressure) : null,

    rain: RAIN_ENABLED
      ? {
          day: inchesToMillimeters(laCrosseObservations.Rain24hr),
          hour: inchesToMillimeters(laCrosseObservations.Rain1hr),
          week: inchesToMillimeters(laCrosseObservations.RainWeek),
        }
      : null,

    wind: WIND_ENABLED
      ? {
          direction: compassToDegrees(laCrosseObservations.WindDir),
          gust: milesToKilometers(laCrosseObservations.GustVelocity),
          speed: milesToKilometers(laCrosseObservations.WindVelocity),
        }
      : null,

    indoor: INDOOR_THERMO_HYGRO_ENABLED
      ? {
          temperature: fahrenheitToCelsius(laCrosseObservations.IndoorTemp),
          humidity: parseInt(laCrosseObservations.IndoorHumid, 10) / 100,
        }
      : null,
  };
}
