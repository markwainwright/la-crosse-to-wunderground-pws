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

  temperature: number | null;
  dewPoint: number | null;
  humidity: number | null;

  pressure: number | null;

  rain: {
    day: number;
    hour: number;
    week: number;
  } | null;

  wind: {
    direction: number;
    gust: number;
    speed: number;
  } | null;

  indoor: {
    temperature: number;
    humidity: number;
  } | null;
}

export interface WundergroundObservations {
  dateutc?: string;

  tempf?: number;
  dewptf?: number;
  humidity?: number;

  baromin?: number;

  rainin?: number;
  dailyrainin?: number;

  winddir?: number;
  windspeedmph?: number;
  windgustmph?: number;
}

export interface ReaderLambdaMessage {
  version: string;
  timestamp: string;
  requestContext: {
    requestId: string;
    functionArn: string;
    condition: 'Success';
    approximateInvokeCount: number;
  };
  requestPayload: {};
  responseContext: { statusCode: number; executedVersion: string };
  responsePayload: Observations;
}
