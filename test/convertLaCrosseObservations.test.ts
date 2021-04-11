import convertLaCrosseObservation from '../src/lib/convertLaCrosseObservation';

describe(convertLaCrosseObservation, () => {
  it('should correctly map La Crosse to Observations shape', () => {
    const laCrosseObservations = {
      Device_id: '0ABC12E3F45678G9',
      model: 'AB1234',
      TimeStamp: '1618200243',
      Icon: '2',
      StormAlarm: '0',
      IndoorTemp: '18.9',
      IndoorHumid: '55',
      OutdoorTemp: '9.9',
      OutdoorHumid: '54',
      DewPoint: '1.02',
      WindDir: 'ESE',
      WindVelocity: 0.5,
      GustVelocity: 2,
      Rain1hr: '0.0',
      Rain24hr: '17.5',
      RainWeek: '30.5',
      RainMonth: '0.0',
      RainTotal: '0.0',
      Pressure: '1022.8',
      Tendency: '1',
      success: 9,
      FeelsLike: '9.9',
      timestamp: null,
      utctime: 1618200243,
    };

    expect(convertLaCrosseObservation(laCrosseObservations)).toEqual({
      indoor: {
        humidity: 0.55,
        temperature: 18.9,
      },
      dewPoint: 1.02,
      humidity: 0.54,
      pressure: 1022.8,
      rain: {
        day: 17.5,
        hour: 0,
        week: 30.5,
      },
      temperature: 9.9,
      wind: {
        direction: 112.5,
        speed: 0.5,
        gust: 2,
      },
      timestamp: '2021-04-12T04:04:03.000Z',
    });
  });

  // TODO: test process.env.*_ENABLED vars
});
