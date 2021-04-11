import { getDegrees } from 'windrose';

export function round(number: number, decimalPlaces = 0) {
  return Math.round(number * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
}

export function celsiusToFahrenheit(c: number) {
  return round(c * 1.8 + 32, 1);
}

export function millimetersToInches(cm: number) {
  return round(cm / 25.4, 1);
}

export function metersPerSecondToMilesPerHour(mps: number) {
  return mps * 2.236936;
}

export function hPaToInHg(hPa: number) {
  return round(hPa / 33.86389, 2);
}

export function compassToDegrees(compassDirection: string) {
  const result = getDegrees(compassDirection);
  return result ? result.value : -1;
}
