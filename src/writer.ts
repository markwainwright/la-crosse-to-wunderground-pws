import { S3Event, SQSHandler } from 'aws-lambda';

import convertToWundergroundObservations from './lib/convertToWundergroundObservation';
import { readFromS3 } from './lib/s3';
import submitToWunderground from './lib/submitToWunderground';

const vars = JSON.parse(process.env.JSON_VARS!);
const { WUNDERGROUND_ID, WUNDERGROUND_PWD } = vars;

interface S3TestEvent {
  Event: 's3:TestEvent';
}

export const handler: SQSHandler = async event => {
  if (!WUNDERGROUND_ID) {
    throw new Error('No WUNDERGROUND_ID defined');
  }

  if (!WUNDERGROUND_PWD) {
    throw new Error('No WUNDERGROUND_PWD defined');
  }

  if (!event.Records || event.Records.length === 0) {
    console.log('Ignoring SQS event with no records');
    return;
  }

  for (const sqsRecord of event.Records) {
    const sqsMessageId = sqsRecord.messageId;
    const s3Event = JSON.parse(sqsRecord.body) as S3Event | S3TestEvent;

    if (!('Records' in s3Event)) {
      console.log('Ignoring S3 event with no records');
      continue;
    }

    for (const s3Record of s3Event.Records) {
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
};
