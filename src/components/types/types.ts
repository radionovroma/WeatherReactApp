export type TWeather = {
  weather: {
    description: string;
    icon: string;
  }[]
  main: {
    temp: number;
    ['feels_like']: number;
    pressure: number;
    humidity: number;
  }
  name: string;
};

export type Units = 'standard' | 'metric' | 'imperial';
