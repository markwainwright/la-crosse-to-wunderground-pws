import { compassToDegrees } from './conversions';
import { LaCrosseObservation, Observation } from './types';

interface Options {
  thermoHygroEnabled: boolean;
  pressureEnabled: boolean;
  rainEnabled: boolean;
  windEnabled: boolean;
  indoorThermoHygroEnabled: boolean;
}

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
  options: Options,
  laCrosseObservation: LaCrosseObservation
): Observation {
  const {
    thermoHygroEnabled,
    pressureEnabled,
    rainEnabled,
    windEnabled,
    indoorThermoHygroEnabled,
  } = options;

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
