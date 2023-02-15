export type TWeather = {
  info: {
    weather: {
      description: string;
      icon: string;
    }[]
    main: {
      temp: number;
      feels_like: number;
      pressure: number;
      humidity: number;
    }
    name: string;
  } | null;
  errorCod: number | null;
};

export type Units = 'standard' | 'metric' | 'imperial';
