const AWS = require('aws-sdk');

const getLaCrosseObservations = require('./lib/getLaCrosseObservations');
const convertLaCrosseToWundergroundObservations = require('./lib/convertLaCrosseToWundergroundObservations');

const { QUEUE_URL } = process.env;

const sqs = new AWS.SQS();

exports.handler = async function() {
  const laCrosseObservations = await getLaCrosseObservations();
  const observations = convertLaCrosseToWundergroundObservations(laCrosseObservations);

  const result = await sqs
    .sendMessage({
      MessageBody: JSON.stringify(observations),
      QueueUrl: QUEUE_URL,
    })
    .promise();

  console.log({ messageId: result.MessageId, observations });
};
