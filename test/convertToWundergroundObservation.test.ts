import convertToWundergroundObservation from '../src/lib/convertToWundergroundObservation';

describe(convertToWundergroundObservation, () => {
  const observations = {
    indoor: {
      humidity: 0.62,
      temperature: 23.2,
    },
    dewPoint: 8.3,
    humidity: 0.67,
    pressure: 997,
    rain: {
      day: 0,
      hour: 0,
      week: 0.5,
    },
    temperature: 14.4,
    wind: {
      direction: 112.5,
      gust: 2,
      speed: 0.5,
    },
    timestamp: '2018-07-13T19:50:18.000Z',
  };

  it('should correctly map to Wunderground shape', () => {
    expect(convertToWundergroundObservation(observations)).toEqual({
      baromin: 29.44,
      dailyrainin: 0,
      dateutc: '2018-07-13 19:50:18',
      dewptf: 46.9,
      humidity: 67,
      rainin: 0,
      tempf: 57.9,
      winddir: 112.5,
      windgustmph: 4.473872,
      windspeedmph: 1.118468,
    });
  });

  it('should handle missing thermo-hygro correctly', () => {
    expect(
      convertToWundergroundObservation({
        ...observations,
        temperature: null,
        dewPoint: null,
        humidity: null,
      })
    ).toEqual({
      baromin: 29.44,
      dailyrainin: 0,
      dateutc: '2018-07-13 19:50:18',
      rainin: 0,
      winddir: 112.5,
      windgustmph: 4.473872,
      windspeedmph: 1.118468,
    });
  });

  it('should handle missing baro pressure correctly', () => {
    expect(convertToWundergroundObservation({ ...observations, pressure: null })).toEqual({
      dailyrainin: 0,
      dateutc: '2018-07-13 19:50:18',
      dewptf: 46.9,
      humidity: 67,
      rainin: 0,
      tempf: 57.9,
      winddir: 112.5,
      windgustmph: 4.473872,
      windspeedmph: 1.118468,
    });
  });

  it('should handle missing wind correctly', () => {
    expect(convertToWundergroundObservation({ ...observations, wind: null })).toEqual({
      baromin: 29.44,
      dailyrainin: 0,
      dateutc: '2018-07-13 19:50:18',
      dewptf: 46.9,
      humidity: 67,
      rainin: 0,
      tempf: 57.9,
    });
  });

  it('should handle missing wind correctly', () => {
    expect(convertToWundergroundObservation({ ...observations, wind: null })).toEqual({
      baromin: 29.44,
      dailyrainin: 0,
      dateutc: '2018-07-13 19:50:18',
      dewptf: 46.9,
      humidity: 67,
      rainin: 0,
      tempf: 57.9,
    });
  });
});
