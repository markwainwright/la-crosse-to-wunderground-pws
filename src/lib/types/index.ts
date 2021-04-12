export interface LaCrosseObservation {
  Device_id: string;
  model: string;
  TimeStamp: string;
  Icon: string;
  StormAlarm: string;
  /** deg c */
  IndoorTemp: string | number;
  /** 0-100 */
  IndoorHumid: string | number;
  /** deg c */
  OutdoorTemp: string | number;
  /** 0-100 */
  OutdoorHumid: string | number;
  /** deg c */
  DewPoint: string | number;
  /** compass */
  WindDir: string;
  /** meters/s */
  WindVelocity: number;
  /** meters/s */
  GustVelocity: number;
  /** mm */
  Rain1hr: string | number;
  /** mm */
  Rain24hr: string | number;
  /** mm */
  RainWeek: string | number;
  /** mm */
  RainMonth: string | number;
  /** mm */
  RainTotal: string | number;
  /** hPa */
  Pressure: string | number;
  Tendency: string;
  success: number;
  /** deg c */
  FeelsLike: string | number;
  timestamp: null;
  utctime: number;
}

export interface Observation {
  timestamp: string;

  /** deg c */
  temperature: number | null;

  /** deg c */
  dewPoint: number | null;

  /** 0-1 */
  humidity: number | null;

  /** hPa */
  pressure: number | null;

  rain: {
    /** mm */
    day: number;
    /** mm */
    hour: number;
    /** mm */
    week: number;
  } | null;

  wind: {
    /** degrees */
    direction: number;

    /** meters/s */
    gust: number;

    /** meters/s */
    speed: number;
  } | null;

  indoor: {
    /** deg c */
    temperature: number;
    humidity: number;
  } | null;
}

export interface WundergroundObservation {
  dateutc?: string;

  /** deg f */
  tempf?: number;

  /** deg f */
  dewptf?: number;

  /** 0-100 */
  humidity?: number;

  /** inHg */
  baromin?: number;

  /** in */
  rainin?: number;

  /** in */
  dailyrainin?: number;

  /** degrees */
  winddir?: number;

  /** miles/hr */
  windspeedmph?: number;

  /** miles/hr */
  windgustmph?: number;
}
