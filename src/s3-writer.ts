import { SNSEvent } from 'aws-lambda';

import writeToS3 from './lib/writeToS3';

const { S3_BUCKET_NAME } = process.env;

export async function handler(event: SNSEvent) {
  if (!S3_BUCKET_NAME) {
    throw new Error('No S3_BUCKET_NAME defined');
  }

  const messages = event.Records.map(record => JSON.parse(record.Sns.Message));

  await Promise.all(
    messages.map(async message => {
      const observations = message.responsePayload;

      const s3Url = await writeToS3(S3_BUCKET_NAME, observations);

      console.log(JSON.stringify({ observations, s3Url }));
    })
  );
}
