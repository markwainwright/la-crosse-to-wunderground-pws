import { Observation, LaCrosseObservation } from './types';

import { compassToDegrees } from './conversions';

const THERMO_HYGRO_ENABLED = process.env.THERMO_HYGRO_ENABLED === '1';
const PRESSURE_ENABLED = process.env.PRESSURE_ENABLED === '1';
const RAIN_ENABLED = process.env.RAIN_ENABLED === '1';
const WIND_ENABLED = process.env.WIND_ENABLED === '1';
const INDOOR_THERMO_HYGRO_ENABLED = process.env.INDOOR_THERMO_HYGRO_ENABLED === '1';

function parseNum(input: number | string, int?: boolean) {
  if (typeof input === 'number') {
    return input;
  } else if (int) {
    return parseInt(input, 10);
  } else {
    return parseFloat(input);
  }
}

export default function convertLaCrosseObservation(
  laCrosseObservation: LaCrosseObservation
): Observation {
  return {
    timestamp: new Date(
      (laCrosseObservation.utctime || parseNum(laCrosseObservation.TimeStamp, true)) * 1000
    ).toISOString(),

    temperature: THERMO_HYGRO_ENABLED ? parseNum(laCrosseObservation.OutdoorTemp) : null,
    dewPoint: THERMO_HYGRO_ENABLED ? parseNum(laCrosseObservation.DewPoint) : null,
    humidity: THERMO_HYGRO_ENABLED ? parseNum(laCrosseObservation.OutdoorHumid, true) / 100 : null,

    pressure: PRESSURE_ENABLED ? parseNum(laCrosseObservation.Pressure) : null,

    rain: RAIN_ENABLED
      ? {
          day: parseNum(laCrosseObservation.Rain24hr),
          hour: parseNum(laCrosseObservation.Rain1hr),
          week: parseNum(laCrosseObservation.RainWeek),
        }
      : null,

    wind: WIND_ENABLED
      ? {
          direction: compassToDegrees(laCrosseObservation.WindDir),
          gust: parseNum(laCrosseObservation.GustVelocity),
          speed: parseNum(laCrosseObservation.WindVelocity),
        }
      : null,

    indoor: INDOOR_THERMO_HYGRO_ENABLED
      ? {
          temperature: parseNum(laCrosseObservation.IndoorTemp),
          humidity: parseNum(laCrosseObservation.IndoorHumid) / 100,
        }
      : null,
  };
}
