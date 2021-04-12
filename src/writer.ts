import { S3Event, SQSEvent } from 'aws-lambda';

import convertToWundergroundObservations from './lib/convertToWundergroundObservation';
import submitToWunderground from './lib/submitToWunderground';
import { readFromS3 } from './lib/s3';

const { WUNDERGROUND_ID, WUNDERGROUND_PWD } = process.env;

export async function handler(event: SQSEvent) {
  if (!WUNDERGROUND_ID) {
    throw new Error('No WUNDERGROUND_ID defined');
  }

  if (!WUNDERGROUND_PWD) {
    throw new Error('No WUNDERGROUND_PWD defined');
  }

  for (const sqsRecord of event.Records) {
    const sqsMessageId = sqsRecord.messageId;
    const s3Message = JSON.parse(sqsRecord.body) as S3Event;

    for (const s3Record of s3Message.Records) {
      const { observation, correlationId } = await readFromS3(
        s3Record.s3.bucket.name,
        decodeURIComponent(s3Record.s3.object.key),
        s3Record.s3.object.eTag
      );
      const wundergroundObservation = convertToWundergroundObservations(observation);

      const status = await submitToWunderground(
        WUNDERGROUND_ID,
        WUNDERGROUND_PWD,
        wundergroundObservation
      );

      console.log(
        JSON.stringify({
          correlationId,
          sqsMessageId,
          stationId: WUNDERGROUND_ID,
          timestamp: observation.timestamp,
          status,
        })
      );
    }
  }
}
