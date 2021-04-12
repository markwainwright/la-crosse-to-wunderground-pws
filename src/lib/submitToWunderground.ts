import axios from 'axios';

import { WundergroundObservation } from './types';

enum Status {
  Submitted = 'Submitted',
}

interface WundergroundParams extends WundergroundObservation {
  dateutc: string;
  action: 'updateraw';
  ID: string;
  PASSWORD: string;
}

export default async function submitToWunderground(
  stationId: string,
  password: string,
  wundergroundObservation: WundergroundObservation
) {
  // See https://support.weather.com/s/article/PWS-Upload-Protocol
  const params: WundergroundParams = {
    dateutc: 'now',
    ...wundergroundObservation,
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

  return Status.Submitted;
}
