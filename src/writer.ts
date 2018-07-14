import submitToWunderground from './lib/submitToWunderground';

interface SQSEvent {
  Records: {
    messageId: string;
    body: string;
  }[];
}

const { WUNDERGROUND_ID, WUNDERGROUND_PWD } = process.env;

export async function handler(event: SQSEvent) {
  if (!WUNDERGROUND_ID) {
    throw new Error('No WUNDERGROUND_ID defined');
  }

  if (!WUNDERGROUND_PWD) {
    throw new Error('No WUNDERGROUND_PWD defined');
  }

  const results = await Promise.all(
    event.Records.map(({ body, messageId }) =>
      submitToWunderground(WUNDERGROUND_ID, WUNDERGROUND_PWD, JSON.parse(body)).then(result => ({
        messageId,
        ...result,
      }))
    )
  );

  results.forEach(result => console.log(result));
}
