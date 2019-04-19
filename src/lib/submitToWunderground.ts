import get from './get';
import { Observations, WundergroundObservations } from '../types';
import convertToWundergroundObservations from './convertToWundergroundObservations';

interface WundergroundParams extends WundergroundObservations {
  dateutc: string;
  action: 'updateraw';
  ID: string;
  PASSWORD: string;
}

export default async function submitToWunderground(
  stationId: string,
  password: string,
  observations: Observations
) {
  // See https://feedback.weather.com/customer/en/portal/articles/2924682-pws-upload-protocol
  const wundergroundObservations = convertToWundergroundObservations(observations);
  const params: WundergroundParams = {
    dateutc: 'now',
    ...wundergroundObservations,
    action: 'updateraw',
    ID: stationId,
    PASSWORD: password,
  };

  const queryString = (Object.keys(params) as (keyof WundergroundParams)[])
    .map(key => `${key}=${encodeURIComponent((params[key] || '').toString())}`)
    .join('&');

  const body = await get({
    host: 'weatherstation.wunderground.com',
    path: `/weatherstation/updateweatherstation.php?${queryString}`,
  });

  if (body.trim() !== 'success') {
    throw new Error(`Unknown Wunderground response: ${body}`);
  }

  return wundergroundObservations;
}
