import https from 'https';
import axios from 'axios';

import { LaCrosseObservation } from './types';

interface LaCrosseResponse {
  device0: {
    success: boolean;
    obs: LaCrosseObservation[];
  };
  device_id: string;
}

export default async function getLaCrosseObservations(deviceId: string, count: number) {
  const { data } = await axios.get<LaCrosseResponse | string>(
    `https://lacrossealertsmobile.com/laxservices/device_info.php?deviceid=${deviceId}&limit=${count}&metric=1`,
    { httpsAgent: new https.Agent({ rejectUnauthorized: false }) } // :(
  );

  if (typeof data !== 'object') {
    throw new Error(`Unknown La Crosse response: ${data}`);
  }

  return data.device0.obs;
}
