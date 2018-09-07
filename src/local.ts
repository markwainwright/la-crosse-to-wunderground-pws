import getObservationsFromLaCrosse from './lib/getObservationsFromLaCrosse';
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

    const observations = await getObservationsFromLaCrosse(LA_CROSSE_DEVICE_ID);
    const result = await submitToWunderground(WUNDERGROUND_ID, WUNDERGROUND_PWD, observations);

    console.log(result);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
