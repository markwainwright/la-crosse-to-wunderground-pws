import { S3Event, SQSHandler } from 'aws-lambda';

import convertToWundergroundObservations from './lib/convertToWundergroundObservation';
import { readFromS3 } from './lib/s3';
import submitToWunderground from './lib/submitToWunderground';

const vars = JSON.parse(process.env.JSON_VARS!);
const { WUNDERGROUND_ID, WUNDERGROUND_PWD } = vars;

export const handler: SQSHandler = async event => {
  if (!WUNDERGROUND_ID) {
    throw new Error('No WUNDERGROUND_ID defined');
  }

  if (!WUNDERGROUND_PWD) {
    throw new Error('No WUNDERGROUND_PWD defined');
  }

  if (!event.Records || event.Records.length === 0) {
    console.log('No records in event');
    return;
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
};
