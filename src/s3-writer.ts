import { SNSEvent } from 'aws-lambda';

import writeToS3 from './lib/writeToS3';
import { ReaderLambdaMessage } from './lib/types';

const { S3_BUCKET_NAME } = process.env;

export async function handler(event: SNSEvent) {
  if (!S3_BUCKET_NAME) {
    throw new Error('No S3_BUCKET_NAME defined');
  }

  const snsRecords = event.Records;

  await Promise.all(
    snsRecords.map(async (snsRecord) => {
      const snsMessageId = snsRecord.Sns.MessageId;

      const lambdaMessage = JSON.parse(snsRecord.Sns.Message) as ReaderLambdaMessage;
      const requestId = lambdaMessage.requestContext.requestId;
      const observations = lambdaMessage.responsePayload;

      const s3Url = await writeToS3(S3_BUCKET_NAME, observations);

      console.log(
        JSON.stringify({
          observations,
          s3Url,
          snsMessageId,
          requestId,
        })
      );
    })
  );
}
