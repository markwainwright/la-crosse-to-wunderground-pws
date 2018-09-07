import get from './get';
import { WundergroundObservations } from './types';

interface WundergroundParams extends WundergroundObservations {
  dateutc: string;
  action: 'updateraw';
  ID: string;
  PASSWORD: string;
}

export default async function submitToWunderground(
  stationId: string,
  password: string,
  observations: WundergroundObservations
) {
  // See http://wiki.wunderground.com/index.php/PWS_-_Upload_Protocol
  const params: WundergroundParams = {
    dateutc: 'now',
    ...observations,
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

  if (body.trim() === 'success') {
    return { observations, stationId };
  } else {
    throw new Error(`Unknown Wunderground response: ${body}`);
  }
}
