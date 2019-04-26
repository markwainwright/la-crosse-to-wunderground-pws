import convertLaCrosseObservations from './lib/convertLaCrosseObservations';
import getLaCrosseObservations from './lib/getLaCrosseObservations';
import submitToWunderground from './lib/submitToWunderground';

const { LA_CROSSE_DEVICE_ID, WUNDERGROUND_ID, WUNDERGROUND_PWD } = process.env;

(async function() {
  try {
    if (!LA_CROSSE_DEVICE_ID) {
      throw new Error('No LA_CROSSE_DEVICE_ID defined');
    }

    if (!WUNDERGROUND_ID) {
      throw new Error('No WUNDERGROUND_ID defined');
    }

    if (!WUNDERGROUND_PWD) {
      throw new Error('No WUNDERGROUND_PWD defined');
    }

    const laCrosseObservations = await getLaCrosseObservations(LA_CROSSE_DEVICE_ID);
    const observations = convertLaCrosseObservations(laCrosseObservations);
    const wundergroundObservations = await submitToWunderground(
      WUNDERGROUND_ID,
      WUNDERGROUND_PWD,
      observations
    );

    console.log({ laCrosseObservations, observations, wundergroundObservations });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
