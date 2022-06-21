import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { Observation } from './types';

const s3 = new S3Client({});

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
    await s3.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: key,
      })
    );

    return Status.AlreadyUploaded;
  } catch (error) {
    if ((error as any).code === 'NotFound') {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: JSON.stringify(observation),
          StorageClass: 'ONEZONE_IA',
          Metadata: {
            [CORRELATION_ID_METADATA_KEY]: correlationId,
          },
        })
      );

      return Status.Uploaded;
    } else {
      throw error;
    }
  }
}

export async function readFromS3(bucketName: string, key: string, eTag: string) {
  const result = await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: key }));

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
