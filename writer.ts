import { SNSMessage, SQSEvent } from 'aws-lambda';

import submitToWunderground from './lib/submitToWunderground';
import writeToS3 from './lib/writeToS3';

const { S3_BUCKET_NAME, WUNDERGROUND_ID, WUNDERGROUND_PWD } = process.env;

export async function handler(event: SQSEvent) {
  if (!WUNDERGROUND_ID) {
    throw new Error('No WUNDERGROUND_ID defined');
  }

  if (!WUNDERGROUND_PWD) {
    throw new Error('No WUNDERGROUND_PWD defined');
  }

  if (!S3_BUCKET_NAME) {
    throw new Error('No S3_BUCKET_NAME defined');
  }

  const messages = event.Records.map(record => JSON.parse(record.body) as SNSMessage);

  await Promise.all(
    messages.map(async message => {
      const observations = JSON.parse(message.Message);

      const [wundergroundObservations, s3Uri] = await Promise.all([
        submitToWunderground(WUNDERGROUND_ID, WUNDERGROUND_PWD, observations),
        writeToS3(S3_BUCKET_NAME, observations),
      ]);

      console.log(
        JSON.stringify({
          messageId: message.MessageId,
          observations,
          wundergroundObservations,
          stationId: WUNDERGROUND_ID,
          s3Uri,
        })
      );
    })
  );
}
