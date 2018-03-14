const {
  getLaCrosseObservations,
  convertToWundergroundObservations,
  submitToWunderground,
} = require('../lib/la-crosse-to-wunderground-pws');

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
  utctime: Math.round(Date.now() / 1000) - 60,
};

const mockWundergroundObservations = {
  tempf: 57.9,
  humidity: '67',
  winddir: 112.5,
  windspeedmph: 0,
  windgustmph: 0,
  rainin: 0,
  dailyrainin: 0.01,
  baromin: 29.44,
  dewptf: 47,
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
    request: jest.fn((obj, callback) => {
      const res = {
        statusCode: 200,
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            callback('success');
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
  test('should extract correct data from response', () => {
    expect.assertions(1);
    expect(getLaCrosseObservations()).resolves.toEqual(mockLaCrosseObservations);
  });
});

describe('convertToWundergroundObservations', () => {
  test('should map values correctly', () => {
    expect(convertToWundergroundObservations(mockLaCrosseObservations)).toEqual(
      mockWundergroundObservations
    );
  });
});

describe('submitToWunderground', () => {
  test('should resolve with a success message and the observation data', () => {
    expect.assertions(1);
    expect(submitToWunderground(mockWundergroundObservations)).resolves.toEqual({
      status: 'success',
      observations: mockWundergroundObservations,
    });
  });
});
