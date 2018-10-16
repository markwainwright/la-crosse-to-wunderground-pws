import * as AWS from 'aws-sdk';

import getObservationsFromLaCrosse from './lib/getObservationsFromLaCrosse';

const { LA_CROSSE_DEVICE_ID, TOPIC_ARN } = process.env;

const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

export async function handler() {
  if (!LA_CROSSE_DEVICE_ID) {
    throw new Error('No LA_CROSSE_DEVICE_ID defined');
  }

  if (!TOPIC_ARN) {
    throw new Error('No TOPIC_ARN defined');
  }

  const observations = await getObservationsFromLaCrosse(LA_CROSSE_DEVICE_ID);

  const result = await sns
    .publish({
      TopicArn: TOPIC_ARN,
      Message: JSON.stringify(observations),
    })
    .promise();

  console.log(
    JSON.stringify({ messageId: result.MessageId, observations, deviceId: LA_CROSSE_DEVICE_ID })
  );
}
