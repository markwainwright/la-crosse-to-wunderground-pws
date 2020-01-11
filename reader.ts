import getLaCrosseObservations from './lib/getLaCrosseObservations';
import convertLaCrosseObservations from './lib/convertLaCrosseObservations';

export async function handler() {
  const { LA_CROSSE_DEVICE_ID } = process.env;

  if (!LA_CROSSE_DEVICE_ID) {
    throw new Error('No LA_CROSSE_DEVICE_ID defined');
  }

  const laCrosseObservations = await getLaCrosseObservations(LA_CROSSE_DEVICE_ID);

  const observations = convertLaCrosseObservations(laCrosseObservations);

  console.log(
    JSON.stringify({
      laCrosseObservations,
      observations,
      deviceId: LA_CROSSE_DEVICE_ID,
    })
  );

  return observations;
}
