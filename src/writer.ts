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
    event.Records.map(record => JSON.parse(record.body)).map((notification: SNSNotification) =>
      submitToWunderground(
        WUNDERGROUND_ID,
        WUNDERGROUND_PWD,
        JSON.parse(notification.Message)
      ).then(result => ({
        messageId: notification.MessageId,
        ...result,
      }))
    )
  );

  results.forEach(result => console.log(result));
}
