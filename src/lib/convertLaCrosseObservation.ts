import { Observation, LaCrosseObservation } from './types';

import { compassToDegrees } from './conversions';

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
  const thermoHygroEnabled = process.env.THERMO_HYGRO_ENABLED === '1';
  const pressureEnabled = process.env.PRESSURE_ENABLED === '1';
  const rainEnabled = process.env.RAIN_ENABLED === '1';
  const windEnabled = process.env.WIND_ENABLED === '1';
  const indoorThermoHygroEnabled = process.env.INDOOR_THERMO_HYGRO_ENABLED === '1';

  return {
    timestamp: new Date(
      (laCrosseObservation.utctime || parseNum(laCrosseObservation.TimeStamp, true)) * 1000
    ).toISOString(),

    temperature: thermoHygroEnabled ? parseNum(laCrosseObservation.OutdoorTemp) : null,
    dewPoint: thermoHygroEnabled ? parseNum(laCrosseObservation.DewPoint) : null,
    humidity: thermoHygroEnabled ? parseNum(laCrosseObservation.OutdoorHumid, true) / 100 : null,

    pressure: pressureEnabled ? parseNum(laCrosseObservation.Pressure) : null,

    rain: rainEnabled
      ? {
          day: parseNum(laCrosseObservation.Rain24hr),
          hour: parseNum(laCrosseObservation.Rain1hr),
          week: parseNum(laCrosseObservation.RainWeek),
        }
      : null,

    wind: windEnabled
      ? {
          direction: compassToDegrees(laCrosseObservation.WindDir),
          gust: parseNum(laCrosseObservation.GustVelocity),
          speed: parseNum(laCrosseObservation.WindVelocity),
        }
      : null,

    indoor: indoorThermoHygroEnabled
      ? {
          temperature: parseNum(laCrosseObservation.IndoorTemp),
          humidity: parseNum(laCrosseObservation.IndoorHumid) / 100,
        }
      : null,
  };
}
