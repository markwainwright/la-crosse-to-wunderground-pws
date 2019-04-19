export interface LaCrosseObservations {
  Device_id: string;
  model: string;
  TimeStamp: string;
  Icon: string;
  StormAlarm: string;
  IndoorTemp: number;
  IndoorHumid: string;
  OutdoorTemp: number;
  OutdoorHumid: string;
  DewPoint: number;
  WindDir: string;
  WindVelocity: number;
  GustVelocity: number;
  Rain1hr: number;
  Rain24hr: number;
  RainWeek: number;
  RainMonth: number;
  RainTotal: number;
  Pressure: number;
  Tendency: string;
  success: number;
  FeelsLike: number;
  timestamp: null;
  utctime: number;
}

export interface Observations {
  timestamp: string;
  outdoor: {
    dewPoint: number;
    humidity: number;
    pressure: number;
    rainDay: number;
    rainHour: number;
    rainWeek: number;
    temperature: number;
    windDirection: number;
    windGust: number;
    windSpeed: number;
  };
  indoor: {
    temperature: number;
    humidity: number;
  };
}

export interface WundergroundObservations {
  tempf: number;
  humidity: number;
  winddir: number;
  windspeedmph: number;
  windgustmph: number;
  rainin: number;
  dailyrainin: number;
  baromin: number;
  dewptf: number;
  dateutc?: string;
}
