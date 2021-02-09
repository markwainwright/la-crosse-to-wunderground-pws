import convertLaCrosseObservations from '../src/lib/convertLaCrosseObservations';

describe('convertLaCrosseObservations', () => {
  it('should correctly map La Crosse to Observations shape', () => {
    const laCrosseObservations = {
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
      Rain24hr: 0.69,
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

    expect(convertLaCrosseObservations(laCrosseObservations)).toEqual({
      indoor: {
        humidity: 0.62,
        temperature: 23.2,
      },
      dewPoint: 8.3,
      humidity: 0.67,
      pressure: 997,
      rain: {
        day: 17.5,
        hour: 0,
        week: 30.5,
      },
      temperature: 14.4,
      wind: {
        direction: 112.5,
        gust: 0,
        speed: 0,
      },
      timestamp: '2018-07-13T19:50:18.000Z',
    });
  });

  // TODO: test process.env.*_ENABLED vars
});
