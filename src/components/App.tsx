import { FC, Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import { Dropdown, Input } from './common';
import { Weather } from './Weather';
import { getWeatherError, getWeatherLoadStatus, getWeatherStart, getWeatherSuccess } from '../store/weather';
import {
  getCity,
  getLocationError,
  getLocationLoadStatus,
  getLocationStart,
  getLocationSuccess
} from '../store/location';
import { getUserAuth, getUserName, inputName, login } from "../store/user";
import { Units } from '../types/units';
import { LOAD_STATUSES } from '../types/loadStatuses';
import css from './styles.module.css';

export const App: FC = () => {
  const [ newCityInput, setNewCityInput ] = useState( '' );
  const [ unit, setUnit ] = useState<Units>( 'metric' );

  const city = useSelector( getCity );
  const userName = useSelector( getUserName );
  const isUserAuth = useSelector( getUserAuth );
  const locationLoadStatus = useSelector( getLocationLoadStatus );
  const weatherLoadStatus = useSelector( getWeatherLoadStatus );
  const dispatch = useDispatch();

  const units: { value: Units, label: string, mark: string }[] = [
    { value: 'metric', label: 'Metric, °C', mark: '°C' },
    { value: 'imperial', label: 'Imperial, °F', mark: '°F' },
    { value: 'standard', label: 'Standard, K', mark: 'K' },
  ];

  const fetchData = (url: string) => {
    return fetch( url )
      .then( data => {
        if (data.ok) {
          return data.json();
        } else {
          throw new Error( 'Network err' );
        }
      } );
  };

  const getWeatherData = useCallback( (cityInput: string, unit: Units) => {
    let citySearch = cityInput ? cityInput : city;
    let urlParams = new URLSearchParams( {
      q: citySearch,
      appid: `${ process.env.REACT_APP_APPID }`,
      units: unit
    } ).toString();
    fetchData( `https://api.openweathermap.org/data/2.5/weather?${ urlParams }` )
      .then( weather => {
        dispatch( getWeatherSuccess( weather ) );
      } )
      .catch( () => {
        dispatch( getWeatherError() );
      } )

  }, [ city, dispatch ] );

  const debouncedSearch = useMemo(
    () => debounce( (city: string, unit: Units) => {
      getWeatherData( city, unit )
    }, 1500 ),
    [ getWeatherData ] );

  const debouncedNameInput = useMemo(
    () => debounce( (name: string) => dispatch( inputName( name ) ), 1500 ),
    [ dispatch ]
  )

  useEffect( () => {
    if (locationLoadStatus === LOAD_STATUSES.UNKNOWN && isUserAuth) {
      dispatch( getLocationStart() );
      fetchData( 'http://ip-api.com/json/' )
        .then( (location) => {
          dispatch( getLocationSuccess( location.city ) );
          dispatch( getWeatherStart() );
          getWeatherData( location.city, unit );
        } )
        .catch( () => {
          dispatch( getLocationError() );
        } );
    }
  }, [ dispatch, getWeatherData, isUserAuth, locationLoadStatus, unit ] );

  useEffect( () => {
    if (locationLoadStatus !== LOAD_STATUSES.UNKNOWN) {
      if (weatherLoadStatus !== LOAD_STATUSES.LOADING) {
        dispatch( getWeatherStart() );
      }
      debouncedSearch( newCityInput || city, unit );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ debouncedSearch, newCityInput ] );


  useEffect( () => {
    if (locationLoadStatus !== LOAD_STATUSES.UNKNOWN) {
      dispatch( getWeatherStart() );
      getWeatherData( newCityInput || city, unit );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ getWeatherData, unit ] );

  return (
    <Fragment>
      <header className={ css.headerBlock }>
        <div className={ css.container }>
          <Input
            placeholder='Weather in city'
            value={ newCityInput }
            onChange={ (e) => setNewCityInput( e.target.value.trim() ) }
          />
          <div className={ css.info }>
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8 0C3.6 0 0 3.6 0 8C0 13.4 7 19.5 7.3 19.8C7.5 19.9 7.8 20 8 20C8.2 20 8.5 19.9 8.7 19.8C9 19.5 16 13.4 16 8C16 3.6 12.4 0 8 0ZM8 17.7C5.9 15.7 2 11.4 2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 10.1 15.7 8 17.7ZM8 4C5.8 4 4 5.8 4 8C4 10.2 5.8 12 8 12C10.2 12 12 10.2 12 8C12 5.8 10.2 4 8 4ZM8 10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6C9.1 6 10 6.9 10 8C10 9.1 9.1 10 8 10Z"
                fill="#444"/>
            </svg>
            <p className={ css.city }>
              { locationLoadStatus === LOAD_STATUSES.LOADED ? city : 'Not found' }
            </p>
            <Dropdown
              value={ unit }
              units={ units }
              onChange={ (e) => setUnit( e.target.value ) }
            />
          </div>
        </div>
        { isUserAuth && <h3 className={ css.message }>Welcome, { userName }</h3> }
      </header>
      <main>
        <div className={ css.containerWeather }>
          {
            !isUserAuth ?
              <div className={ css.login }>
                <input
                  className={ css.loginInput }
                  placeholder='Your name'
                  onChange={ (e) => debouncedNameInput( e.target.value ) }/>
                <button
                  className={ css.loginBtn }
                  onClick={ () => (userName && dispatch( login() )) }>
                  Login
                </button>
              </div> :
              <>
                {
                  weatherLoadStatus === LOAD_STATUSES.ERROR &&
                  <p className={ css.error }>
                    'An error has occurred, please try again later'
                  </p>
                }
                {
                  (weatherLoadStatus === LOAD_STATUSES.LOADING || weatherLoadStatus === LOAD_STATUSES.UNKNOWN) &&
                  <div className={ css.ldsRing }>
                    <div></div>
                  </div>
                }
                {
                  weatherLoadStatus === LOAD_STATUSES.LOADED &&
                  <Weather
                    unit={ unit }
                    units={ units }/>
                }
              </>
          }
        </div>
      </main>
    </Fragment>
  );
}
