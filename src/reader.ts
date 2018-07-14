import * as AWS from 'aws-sdk';

import getLaCrosseObservations from './lib/getLaCrosseObservations';

const { LA_CROSSE_DEVICE_ID, QUEUE_URL } = process.env;

const sqs = new AWS.SQS();

export async function handler() {
  if (!LA_CROSSE_DEVICE_ID) {
    throw new Error('No LA_CROSSE_DEVICE_ID defined');
  }

  if (!QUEUE_URL) {
    throw new Error('No QUEUE_URL defined');
  }

  const observations = await getLaCrosseObservations(LA_CROSSE_DEVICE_ID);

  const result = await sqs
    .sendMessage({
      MessageBody: JSON.stringify(observations),
      QueueUrl: QUEUE_URL,
    })
    .promise();

  console.log({ messageId: result.MessageId, observations, deviceId: LA_CROSSE_DEVICE_ID });
}
