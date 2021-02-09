import axios from 'axios';

import { Observations, WundergroundObservations } from './types';
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
  // See https://support.weather.com/s/article/PWS-Upload-Protocol
  const wundergroundObservations = convertToWundergroundObservations(observations);
  const params: WundergroundParams = {
    dateutc: 'now',
    ...wundergroundObservations,
    action: 'updateraw',
    ID: stationId,
    PASSWORD: password,
  };

  const { data } = await axios.get<string>(
    'http://weatherstation.wunderground.com/weatherstation/updateweatherstation.php',
    { params }
  );

  if (data.trim() !== 'success') {
    throw new Error(`Unknown Wunderground response: ${data}`);
  }

  return wundergroundObservations;
}
