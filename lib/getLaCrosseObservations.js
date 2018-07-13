const get = require('./get');
const convertLaCrosseToWundergroundObservations = require('./convertLaCrosseToWundergroundObservations');

module.exports = async function getLaCrosseObservations(deviceId) {
  const body = await get({
    host: 'lacrossealertsmobile.com',
    path: `/laxservices/device_info.php?deviceid=${deviceId}`,
  });

  return convertLaCrosseToWundergroundObservations(JSON.parse(body).device0.obs[0]);
};
