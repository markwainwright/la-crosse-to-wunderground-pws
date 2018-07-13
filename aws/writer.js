const submitToWunderground = require('./lib/submitToWunderground');

const { WUNDERGROUND_ID, WUNDERGROUND_PWD } = process.env;

exports.handler = async function(event) {
  const results = await Promise.all(
    event.Records.map(record => record.body)
      .map(JSON.parse)
      .map(observations => submitToWunderground(WUNDERGROUND_ID, WUNDERGROUND_PWD, observations))
  );

  console.log(results);
};
