import { S3 } from 'aws-sdk';

import { Observations } from './types';

const s3 = new S3();

export default async function writeToS3(bucketName: string, observations: Observations) {
  await s3
    .putObject({
      Bucket: bucketName,
      Key: `${observations.timestamp}.json`,
      Body: JSON.stringify(observations),
    })
    .promise();
}
