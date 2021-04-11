import { Context, EventBridgeEvent } from 'aws-lambda';

import getLaCrosseObservations from './lib/getLaCrosseObservations';
import convertLaCrosseObservation from './lib/convertLaCrosseObservation';

const { LA_CROSSE_DEVICE_ID } = process.env;

interface Event extends EventBridgeEvent<'Scheduled Event', {}> {
  count: number;
}

export async function handler(event: Event, context: Context) {
  if (!LA_CROSSE_DEVICE_ID) {
    throw new Error('No LA_CROSSE_DEVICE_ID defined');
  }

  const { count } = event;

  if (typeof count !== 'number' || count < 1) {
    throw new Error(`Invalid 'count': ${count}`);
  }

  const laCrosseObservations = await getLaCrosseObservations(LA_CROSSE_DEVICE_ID, count);
  const observations = laCrosseObservations.map(convertLaCrosseObservation);

  console.log(
    JSON.stringify({
      laCrosseObservations,
      observations,
      deviceId: LA_CROSSE_DEVICE_ID,
      requestId: context.awsRequestId,
    })
  );

  return observations;
}
