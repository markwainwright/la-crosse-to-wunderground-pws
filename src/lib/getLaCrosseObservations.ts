import axios from 'axios';

import { LaCrosseObservations } from './types';

interface LaCrosseResponse {
  device0: {
    success: boolean;
    obs: LaCrosseObservations[];
  };
  device_id: string;
}

export default async function getLaCrosseObservations(deviceId: string) {
  const { data } = await axios.get<LaCrosseResponse | string>(
    `http://lacrossealertsmobile.com/laxservices/device_info.php?deviceid=${deviceId}`
  );

  if (typeof data !== 'object') {
    throw new Error(`Unknown La Crosse response: ${data}`);
  }

  return data.device0.obs[0];
}
