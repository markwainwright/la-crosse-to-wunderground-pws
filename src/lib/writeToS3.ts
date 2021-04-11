import { S3 } from 'aws-sdk';

import { Observation } from './types';

const s3 = new S3();

export default async function writeToS3(bucketName: string, observation: Observation) {
  const key = `v2/${observation.timestamp}.json`;

  await s3
    .putObject({
      Bucket: bucketName,
      Key: key,
      Body: JSON.stringify(observation),
    })
    .promise();

  return `s3://${bucketName}/${key}`;
}
