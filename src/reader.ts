import { Handler } from 'aws-lambda';

import convertLaCrosseObservation from './lib/convertLaCrosseObservation';
import getLaCrosseObservations from './lib/getLaCrosseObservations';
import { writeToS3 } from './lib/s3';
import { Observation } from './lib/types';

interface FunctionPayload {
  count: number;
}
type FunctionHandler = Handler<FunctionPayload, Observation[]>;

const vars = JSON.parse(process.env.JSON_VARS!);
const { LA_CROSSE_DEVICE_ID, S3_BUCKET_NAME } = vars;

const options = {
  thermoHygroEnabled: vars.THERMO_HYGRO_ENABLED,
  pressureEnabled: vars.PRESSURE_ENABLED,
  rainEnabled: vars.RAIN_ENABLED,
  windEnabled: vars.WIND_ENABLED,
  indoorThermoHygroEnabled: vars.INDOOR_THERMO_HYGRO_ENABLED,
};

export const handler: FunctionHandler = async (event, context) => {
  if (!LA_CROSSE_DEVICE_ID) {
    throw new Error('No LA_CROSSE_DEVICE_ID defined');
  }

  if (!S3_BUCKET_NAME) {
    throw new Error('No S3_BUCKET_NAME defined');
  }

  const { count } = event;
  if (typeof count !== 'number' || count < 1) {
    throw new Error(`Invalid 'count': ${count}`);
  }

  const correlationId = context.awsRequestId;

  const laCrosseObservations = await getLaCrosseObservations(LA_CROSSE_DEVICE_ID, count);
  const observations = laCrosseObservations.map(obs => convertLaCrosseObservation(options, obs));

  for (const observation of observations) {
    const status = await writeToS3(S3_BUCKET_NAME, observation, correlationId);

    console.log(
      JSON.stringify({
        correlationId,
        deviceId: LA_CROSSE_DEVICE_ID,
        timestamp: observation.timestamp,
        status,
      })
    );
  }

  return observations;
};
