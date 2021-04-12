import { Context, EventBridgeEvent } from 'aws-lambda';

import getLaCrosseObservations from './lib/getLaCrosseObservations';
import convertLaCrosseObservation from './lib/convertLaCrosseObservation';
import { writeToS3 } from './lib/s3';

const { LA_CROSSE_DEVICE_ID, S3_BUCKET_NAME } = process.env;

interface Event extends EventBridgeEvent<'Scheduled Event', {}> {
  count: number;
}

export async function handler(event: Event, context: Context) {
  if (!LA_CROSSE_DEVICE_ID) {
    throw new Error('No LA_CROSSE_DEVICE_ID defined');
  }

  if (!S3_BUCKET_NAME) {
    throw new Error('No S3_BUCKET_NAME defined');
  }

  const { count } = event;
  if (typeof count !== 'number' || count < 1) {
    throw new Error(`Invalid 'count': ${count}`);
  }

  const correlationId = context.awsRequestId;

  const laCrosseObservations = await getLaCrosseObservations(LA_CROSSE_DEVICE_ID, count);
  const observations = laCrosseObservations.map(convertLaCrosseObservation);

  for (const observation of observations) {
    const status = await writeToS3(S3_BUCKET_NAME, observation, correlationId);

    console.log(
      JSON.stringify({
        correlationId,
        deviceId: LA_CROSSE_DEVICE_ID,
        timestamp: observation.timestamp,
        status,
      })
    );
  }
}
