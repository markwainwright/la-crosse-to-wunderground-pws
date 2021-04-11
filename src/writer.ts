import { SNSMessage, SQSEvent } from 'aws-lambda';

import convertToWundergroundObservations from './lib/convertToWundergroundObservation';
import submitToWunderground from './lib/submitToWunderground';
import { ReaderLambdaMessage } from './lib/types';

const { WUNDERGROUND_ID, WUNDERGROUND_PWD } = process.env;

export async function handler(event: SQSEvent) {
  if (!WUNDERGROUND_ID) {
    throw new Error('No WUNDERGROUND_ID defined');
  }

  if (!WUNDERGROUND_PWD) {
    throw new Error('No WUNDERGROUND_PWD defined');
  }

  const sqsRecords = event.Records;

  await Promise.all(
    sqsRecords.map(async record => {
      const sqsMessageId = record.messageId;

      const snsMessage = JSON.parse(record.body) as SNSMessage;
      const snsMessageId = snsMessage.MessageId;

      const lambdaMessage = JSON.parse(snsMessage.Message) as ReaderLambdaMessage;
      const requestId = lambdaMessage.requestContext.requestId;
      const observations = lambdaMessage.responsePayload;
      const wundergroundObservations = observations.map(convertToWundergroundObservations);

      for (const wundergroundObservation of wundergroundObservations) {
        await submitToWunderground(WUNDERGROUND_ID, WUNDERGROUND_PWD, wundergroundObservation);
      }

      console.log(
        JSON.stringify({
          observations,
          wundergroundObservations,
          stationId: WUNDERGROUND_ID,
          sqsMessageId,
          snsMessageId,
          requestId,
        })
      );
    })
  );
}
