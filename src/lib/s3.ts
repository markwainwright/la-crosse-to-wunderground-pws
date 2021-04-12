import { S3 } from 'aws-sdk';

import { Observation } from './types';

const s3 = new S3();

enum Status {
  Uploaded = 'Uploaded',
  AlreadyUploaded = 'AlreadyUploaded',
}

const CORRELATION_ID_METADATA_KEY = 'correlation-id'; // Must be lower case

export async function writeToS3(
  bucketName: string,
  observation: Observation,
  correlationId: string
) {
  const key = `v2/${observation.timestamp}.json`;

  try {
    await s3
      .headObject({
        Bucket: bucketName,
        Key: key,
      })
      .promise();

    return Status.AlreadyUploaded;
  } catch (error) {
    if (error.code === 'NotFound') {
      await s3
        .putObject({
          Bucket: bucketName,
          Key: key,
          Body: JSON.stringify(observation),
          Metadata: {
            [CORRELATION_ID_METADATA_KEY]: correlationId,
          },
        })
        .promise();

      return Status.Uploaded;
    } else {
      throw error;
    }
  }
}

export async function readFromS3(bucketName: string, key: string, eTag: string) {
  const result = await s3.getObject({ Bucket: bucketName, Key: key }).promise();

  if (!result.Body) {
    throw new Error('No body');
  }

  if (result.ETag !== `"${eTag}"`) {
    throw new Error(`Unexpected ETag of '${key}'`);
  }

  return {
    observation: JSON.parse(result.Body.toString('utf-8')) as Observation,
    correlationId: result.Metadata?.[CORRELATION_ID_METADATA_KEY],
  };
}
