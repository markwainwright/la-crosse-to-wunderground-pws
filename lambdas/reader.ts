import { SNS } from 'aws-sdk';

import getLaCrosseObservations from '../lib/getLaCrosseObservations';
import convertLaCrosseObservations from '../lib/convertLaCrosseObservations';

const sns = new SNS({ apiVersion: '2010-03-31' });

export async function handler() {
  const { LA_CROSSE_DEVICE_ID, TOPIC_ARN } = process.env;

  if (!LA_CROSSE_DEVICE_ID) {
    throw new Error('No LA_CROSSE_DEVICE_ID defined');
  }

  if (!TOPIC_ARN) {
    throw new Error('No TOPIC_ARN defined');
  }

  const laCrosseObservations = await getLaCrosseObservations(LA_CROSSE_DEVICE_ID);

  const observations = convertLaCrosseObservations(laCrosseObservations);

  const result = await sns
    .publish({
      TopicArn: TOPIC_ARN,
      Message: JSON.stringify(observations),
    })
    .promise();

  console.log(
    JSON.stringify({
      messageId: result.MessageId,
      laCrosseObservations,
      observations,
      deviceId: LA_CROSSE_DEVICE_ID,
    })
  );
}
