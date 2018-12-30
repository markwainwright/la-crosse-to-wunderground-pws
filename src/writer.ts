import submitToWunderground from './lib/submitToWunderground';

interface Event {
  Records: {
    messageId: string;
    body: string; // SNSNotification as JSON string
  }[];
}

interface SNSNotification {
  Type: 'Notification';
  MessageId: string;
  Message: string;
}

const { WUNDERGROUND_ID, WUNDERGROUND_PWD } = process.env;

export async function handler(event: Event) {
  if (!WUNDERGROUND_ID) {
    throw new Error('No WUNDERGROUND_ID defined');
  }

  if (!WUNDERGROUND_PWD) {
    throw new Error('No WUNDERGROUND_PWD defined');
  }

  const results = await Promise.all(
    event.Records.map(record => JSON.parse(record.body)).map(
      async (notification: SNSNotification) => {
        const observations = JSON.parse(notification.Message);

        const wundergroundObservations = await submitToWunderground(
          WUNDERGROUND_ID,
          WUNDERGROUND_PWD,
          observations
        );

        return {
          messageId: notification.MessageId,
          observations,
          wundergroundObservations,
          stationId: WUNDERGROUND_ID,
        };
      }
    )
  );

  results.forEach(result => console.log(JSON.stringify(result)));
}
