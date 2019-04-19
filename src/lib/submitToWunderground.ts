import * as querystring from 'querystring';

import get from './get';
import { Observations, WundergroundObservations } from '../types';
import convertToWundergroundObservations from './convertToWundergroundObservations';

interface WundergroundParams extends WundergroundObservations {
  [key: string]: string | number;
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

  const body = await get({
    host: 'weatherstation.wunderground.com',
    path: `/weatherstation/updateweatherstation.php?${querystring.stringify(params)}`,
  });

  if (body.trim() !== 'success') {
    throw new Error(`Unknown Wunderground response: ${body}`);
  }

  return wundergroundObservations;
}
