import convertToWundergroundObservations from '../src/lib/convertToWundergroundObservations';

describe('convertToWundergroundObservations', () => {
  test('should correctly map to Wunderground shape', () => {
    const observations = {
      indoor: {
        humidity: 0.62,
        temperature: 23.2,
      },
      outdoor: {
        dewPoint: 8.3,
        humidity: 0.67,
        pressure: 997,
        rainDay: 0,
        rainHour: 0,
        rainWeek: 0.5,
        temperature: 14.4,
        windDirection: 112.5,
        windGust: 0,
        windSpeed: 0,
      },
      timestamp: '2018-07-13T19:50:18.000Z',
    };

    expect(convertToWundergroundObservations(observations)).toEqual({
      baromin: 29.44,
      dailyrainin: 0,
      dateutc: '2018-07-13 19:50:18',
      dewptf: 46.9,
      humidity: 67,
      rainin: 0,
      tempf: 57.9,
      winddir: 112.5,
      windgustmph: 0,
      windspeedmph: 0,
    });
  });
});
