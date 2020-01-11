import { SNSMessage, SQSEvent } from 'aws-lambda';

import submitToWunderground from './lib/submitToWunderground';

const { WUNDERGROUND_ID, WUNDERGROUND_PWD } = process.env;

export async function handler(event: SQSEvent) {
  if (!WUNDERGROUND_ID) {
    throw new Error('No WUNDERGROUND_ID defined');
  }

  if (!WUNDERGROUND_PWD) {
    throw new Error('No WUNDERGROUND_PWD defined');
  }

  const messages = event.Records.map(record => JSON.parse(record.body) as SNSMessage);

  await Promise.all(
    messages.map(async message => {
      const observations = JSON.parse(message.Message).responsePayload;

      const wundergroundObservations = await submitToWunderground(
        WUNDERGROUND_ID,
        WUNDERGROUND_PWD,
        observations
      );

      console.log(
        JSON.stringify({
          observations,
          wundergroundObservations,
          stationId: WUNDERGROUND_ID,
        })
      );
    })
  );
}
