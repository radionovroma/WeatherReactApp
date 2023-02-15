import { FC, Fragment, useState, useEffect, useCallback, useMemo} from 'react';
import debounce from 'lodash/debounce';
import { Input, Dropdown } from "./common";
import { Weather } from "./Weather";
import { TWeather, Units } from "../types/types";
import css from './styles.module.css';

enum LOAD_STATUSES {
  LOADED = 'loaded',
  LOADING = 'loading',
  ERROR = 'error',
  INITIAL = 'initial',
}

export const App: FC = () => {
  const [city, setCity] = useState('');
  const [newCityInput, setNewCityInput] = useState('');
  const [unit, setUnit] = useState<Units>('metric');
  const [loadStatus, setLoadStatus] = useState({location: LOAD_STATUSES.INITIAL, weather: LOAD_STATUSES.INITIAL});
  const [weather, setWeather] = useState<TWeather>({info: null, errorCod: null});

  const localStorageKey = 'city';
  const units: {value: Units, label: string, mark: string}[] =[
    { value: 'metric', label: 'Metric, °C', mark: '°C'},
    { value: 'imperial', label: 'Imperial, °F', mark: '°F'},
    { value: 'standard', label: 'Standard, K', mark: 'K'},
  ];

  const fetchData = (url: string, request: 'weather' | 'location') => {
    return fetch(url)
      .then(data => {
        if (data.ok) {
         return data.json();
        } else {
         if ( request === 'weather') {
           setWeather((prevWeather) => ({...prevWeather, errorCod: data.status}));
         }
         throw new Error('Network err');
        }
      });
  };

  const getWeatherData = useCallback((cityInput: string, unit: Units) => {
    let citySearch = cityInput ? cityInput : city;
    let urlParams = new URLSearchParams({ q: citySearch, appid: `${process.env.REACT_APP_APPID}`, units: unit }).toString();
    fetchData(`https://api.openweathermap.org/data/2.5/weather?${urlParams}`, 'weather')
      .then(info => {
        setWeather((prevWeather) => ({...prevWeather, info}));
        setLoadStatus((prevStatus) => ({...prevStatus, weather: LOAD_STATUSES.LOADED}));
      })
      .catch(() => {
        setWeather((prevWeather) => ({ ...prevWeather, info: null }));
        setLoadStatus((prevStatus) => ({...prevStatus, weather: LOAD_STATUSES.ERROR}));
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((city: string, unit: Units) => { getWeatherData(city, unit) }, 1500), [getWeatherData]
  )

  useEffect(() => {
    if (!city && loadStatus.location === LOAD_STATUSES.INITIAL) {
      fetchData('http://ip-api.com/json/', 'location')
        .then((location) => {
          setCity(location.city);
          setLoadStatus((prevStatus) => ({...prevStatus, location: LOAD_STATUSES.LOADED}));
          localStorage.setItem(localStorageKey, location.city);
          getWeatherData(location.city, unit);
        })
        .catch(() => {
          setCity('Minsk');
          setLoadStatus((prevStatus) => ({...prevStatus, location: LOAD_STATUSES.ERROR}));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  useEffect(() => {
    if (loadStatus.location !== LOAD_STATUSES.INITIAL) {
      setLoadStatus((prevStatus) => ({ ...prevStatus, weather: LOAD_STATUSES.LOADING}));
      setWeather((prevWeather) => ({ ...prevWeather, errorCod: null}));
      debouncedSearch(newCityInput || city, unit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, newCityInput]);


  useEffect(() => {
    if (loadStatus.location !== LOAD_STATUSES.INITIAL) {
      setLoadStatus((prevStatus) => ({ ...prevStatus, weather: LOAD_STATUSES.LOADING}));
      getWeatherData(newCityInput || city, unit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getWeatherData, unit]);

  return (
    <Fragment>
      <header className={ css.headerBlock }>
        <div className={ css.container }>
          <Input
            placeholder='Weather in city'
            value={ newCityInput }
            onChange={ (e) => setNewCityInput(e.target.value.trim())}
          />
          <div className={ css.info }>
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.6 0 0 3.6 0 8C0 13.4 7 19.5 7.3 19.8C7.5 19.9 7.8 20 8 20C8.2 20 8.5 19.9 8.7 19.8C9 19.5 16 13.4 16 8C16 3.6 12.4 0 8 0ZM8 17.7C5.9 15.7 2 11.4 2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 10.1 15.7 8 17.7ZM8 4C5.8 4 4 5.8 4 8C4 10.2 5.8 12 8 12C10.2 12 12 10.2 12 8C12 5.8 10.2 4 8 4ZM8 10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6C9.1 6 10 6.9 10 8C10 9.1 9.1 10 8 10Z" fill="#444"/>
            </svg>
            <p className={css.city}>
              { loadStatus.location === LOAD_STATUSES.LOADED ? city : 'Not found'  }
            </p>
            <Dropdown
              value={unit}
              units={units}
              onChange={ (e) => setUnit(e.target.value)}
            />
          </div>
        </div>
      </header>
      <main>
        <div className={ css.containerWeather }>
          { loadStatus.weather === LOAD_STATUSES.ERROR &&
            <p className={ css.error }>
              {weather.errorCod === 404 ?
                'The city you are looking for is not found - try changing the query' :
                'An error has occurred, please try again later'}
            </p>
          }
          { (loadStatus.weather === LOAD_STATUSES.LOADING || loadStatus.weather === LOAD_STATUSES.INITIAL) &&
            <div className={css.ldsRing}>
              <div></div>
            </div>
          }
          { loadStatus.weather === LOAD_STATUSES.LOADED &&
            weather.info !== null &&
            <Weather
              weatherInfo={weather.info}
              unit={ unit }
              units={ units }
            />
          }
        </div>
      </main>
    </Fragment>
  );
}
