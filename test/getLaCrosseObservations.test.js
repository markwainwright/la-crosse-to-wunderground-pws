const getLaCrosseObservations = require('../lib/getLaCrosseObservations');
const convertLaCrosseToWundergroundObservations = require('../lib/convertLaCrosseToWundergroundObservations');

const mockLaCrosseObservations = {
  Device_id: '7FFF64F0F12828B9',
  model: 'WS2816',
  TimeStamp: '1495268534',
  Icon: '1',
  StormAlarm: '0',
  IndoorTemp: 73.8,
  IndoorHumid: '62',
  OutdoorTemp: 57.9,
  OutdoorHumid: '67',
  DewPoint: 47,
  WindDir: 'ESE',
  WindVelocity: 0,
  GustVelocity: 0,
  Rain1hr: 0,
  Rain24hr: 0.01,
  RainWeek: 1.2,
  RainMonth: 3.99,
  RainTotal: 139.63,
  Pressure: 29.44,
  Tendency: '2',
  success: 9,
  FeelsLike: 57.9,
  timestamp: null,
  utctime: 1531511418,
};

const expectedWundergroundObservations = {
  tempf: 57.9,
  humidity: 67,
  winddir: 112.5,
  windspeedmph: 0,
  windgustmph: 0,
  rainin: 0,
  dailyrainin: 0.01,
  baromin: 29.44,
  dewptf: 47,
  dateutc: '2018-07-13 19:50:18',
};

jest.mock('http', () => {
  return {
    get: jest.fn((url, callback) => {
      const res = {
        statusCode: 200,
        setEncoding: () => res,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback(
              JSON.stringify({
                device0: { obs: [mockLaCrosseObservations, { foo: 'bar' }] },
              })
            );
          } else {
            callback();
          }
          return res;
        }),
      };
      callback(res);
      return { on: () => {} };
    }),
  };
});

describe('getLaCrosseObservations', () => {
  test('should correctly map response to Wunderground observation shape', () => {
    expect.assertions(1);
    expect(getLaCrosseObservations('aDeviceId')).resolves.toEqual(expectedWundergroundObservations);

    // TODO: Assert that http.get was called with the correct host and path (i.e. with given device ID)
  });
});
