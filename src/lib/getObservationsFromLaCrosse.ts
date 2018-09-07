import get from './get';
import convertLaCrosseToWundergroundObservations from './convertLaCrosseToWundergroundObservations';
import { WundergroundObservations, LaCrosseObservations } from './types';

interface LaCrosseResponse {
  device0: {
    success: boolean;
    obs: LaCrosseObservations[];
  };
  device_id: string;
}

export default async function getObservationsFromLaCrosse(
  deviceId: string
): Promise<WundergroundObservations> {
  const body = await get({
    host: 'lacrossealertsmobile.com',
    path: `/laxservices/device_info.php?deviceid=${deviceId}`,
  });

  const laCrosseResponse = JSON.parse(body) as LaCrosseResponse;

  return convertLaCrosseToWundergroundObservations(laCrosseResponse.device0.obs[0]);
}
