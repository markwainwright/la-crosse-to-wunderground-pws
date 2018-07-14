import submitToWunderground from '../src/lib/submitToWunderground';

const mockWundergroundObservations = {
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
    get: jest.fn((_settings, callback) => {
      const res = {
        statusCode: 200,
        setEncoding: () => res,
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

describe('submitToWunderground', () => {
  test('should resolve with a success message and the observation data', () => {
    expect.assertions(1);
    expect(submitToWunderground('id', 'password', mockWundergroundObservations)).resolves.toEqual({
      stationId: 'id',
      observations: mockWundergroundObservations,
    });

    // TODO: Assert that http.get was called with the correct host and path (i.e. with given ID and
    // password)
  });
});
