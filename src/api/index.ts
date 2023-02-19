import { WeatherInfo } from "../types/weather";

const WEATHER_URL = new URL("https://api.openweathermap.org/data/2.5/weather");
const LOCATION_URL  = new URL("http://ip-api.com/json/");
const APP_ID = process.env.REACT_APP_APPID;

const fetchData = (url: URL) => {
  return fetch( url )
    .then( data => {
      if (data.ok) {
        return data.json();
      } else {
        throw new Error( 'Network err' );
      }
    } );
};

export const getWeather = (q: string, units: string): Promise<WeatherInfo> => {
  const searchParams = new URLSearchParams({
    q,
    appId: APP_ID,
    units
  } as Record<string, string>).toString();

  const url = new URL(WEATHER_URL);

  url.search = searchParams
  return fetchData(url);
};

export const getLocation = (): Promise<{ city: string }> => {
  return fetchData(LOCATION_URL);
};

