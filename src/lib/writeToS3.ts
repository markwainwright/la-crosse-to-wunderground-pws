import { S3 } from 'aws-sdk';

import { Observations } from './types';

const s3 = new S3();

export default async function writeToS3(bucketName: string, observations: Observations) {
  const key = `v2/${observations.timestamp}.json`;

  await s3
    .putObject({
      Bucket: bucketName,
      Key: key,
      Body: JSON.stringify(observations),
    })
    .promise();

  return `s3://${bucketName}/${key}`;
}
