import { Context, EventBridgeEvent } from 'aws-lambda';

import getLaCrosseObservations from './lib/getLaCrosseObservations';
import convertLaCrosseObservations from './lib/convertLaCrosseObservations';

const { LA_CROSSE_DEVICE_ID } = process.env;

export async function handler(event: EventBridgeEvent<'Scheduled Event', {}>, context: Context) {
  if (!LA_CROSSE_DEVICE_ID) {
    throw new Error('No LA_CROSSE_DEVICE_ID defined');
  }

  const laCrosseObservations = await getLaCrosseObservations(LA_CROSSE_DEVICE_ID);

  const observations = convertLaCrosseObservations(laCrosseObservations);

  console.log(
    JSON.stringify({
      laCrosseObservations,
      observations,
      deviceId: LA_CROSSE_DEVICE_ID,
      requestId: context.awsRequestId,
      eventId: event.id,
    })
  );

  return observations;
}
