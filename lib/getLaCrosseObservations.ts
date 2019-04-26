import get from './get';
import { LaCrosseObservations } from './types';

interface LaCrosseResponse {
  device0: {
    success: boolean;
    obs: LaCrosseObservations[];
  };
  device_id: string;
}

export default async function getLaCrosseObservations(deviceId: string) {
  const body = await get({
    host: 'lacrossealertsmobile.com',
    path: `/laxservices/device_info.php?deviceid=${deviceId}`,
  });

  const laCrosseResponse = JSON.parse(body) as LaCrosseResponse;

  return laCrosseResponse.device0.obs[0];
}
