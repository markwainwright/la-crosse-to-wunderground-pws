import { getDegrees } from 'windrose';

export function round(number: number, decimalPlaces = 0) {
  return Math.round(number * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
}

export function fahrenheitToCelsius(f: number) {
  return round((f - 32) / 1.8, 1);
}

export function celsiusToFahrenheit(c: number) {
  return round(c * 1.8 + 32, 1);
}

export function inchesToCentimeters(i: number) {
  return round(i * 2.54, 1);
}

export function centimetersToInches(cm: number) {
  return round(cm / 2.54, 1);
}

export function milesToKilometers(m: number) {
  return round(m * 1.609344, 2);
}

export function kilometersToMiles(k: number) {
  return round(k / 1.609344, 2);
}

export function inHgToHPa(inHg: number) {
  return round(inHg * 33.86389, 1);
}

export function hPaToInHg(hPa: number) {
  return round(hPa / 33.86389, 2);
}

export function compassToDegrees(compassDirection: string) {
  const result = getDegrees(compassDirection);
  return result ? result.value : -1;
}
