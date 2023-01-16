import { Component, Fragment } from 'react';
import debounce from 'lodash/debounce';
import { Input, Dropdown, Weather } from "./common";
import { TWeather, Units } from "./types/types";
import css from './styles.module.css';

interface AppState {
  city: string;
  unit: Units;
  newCityInput: string;

  weatherInfo: TWeather | null;
  locationErr: boolean;
  weatherErr: boolean;
  isLocationLoading: boolean;
  isWeatherLoading: boolean;
  error: string;
}

export class App extends Component<{}, AppState> {
  state: AppState = {
    city: '',
    unit: 'metric',
    newCityInput: '',
    weatherInfo: null,
    locationErr: false,
    weatherErr: false,
    isLocationLoading: true,
    isWeatherLoading: true,
    error: '',
  };

  localStorageKey = 'city';

  debouncedSearch = debounce((newCityInput: AppState['newCityInput']) => {
    this.getWeatherData(newCityInput || this.state.city, this.state.unit);
  }, 1500);

  searchHandler = (newCityInput: AppState['newCityInput']) => {
    this.setState({ newCityInput, isWeatherLoading: true, weatherErr: false, error: '' });
    this.debouncedSearch(newCityInput);
  }

  toggleUnitsHandler =  (unit: AppState['unit']) => {
    this.setState({ unit })
    this.getWeatherData(this.state.newCityInput || this.state.city, unit);
  };

  getWeatherData = (city: AppState['city'], unit: AppState['unit']) => {
    let urlParams = new URLSearchParams({ q: city, appid: `${process.env.REACT_APP_APPID}`, units: unit }).toString();
    fetch(`https://api.openweathermap.org/data/2.5/weather?${urlParams}`)
      .then(weather => {
        if (weather.ok) {
          return weather.json()
        }  else {
          console.log(weather);
          if (weather.status === 404) {
            this.setState({ error: '404'});
          }
          throw new Error('Network err')
        }})
      .then(weatherInfo => {
        this.setState( { weatherInfo, isWeatherLoading: false, error: ''} )
      })
      .catch(() => {
        this.setState( { weatherErr: true, isWeatherLoading: false, weatherInfo: null})
      })
  }

  componentDidMount() {
    const city = localStorage.getItem(this.localStorageKey) ?? '[]';
    if (city.length) {
      this.setState({ city });
    }
    if (this.state.city === '' && this.state.isLocationLoading){
      fetch('http://ip-api.com/json/')
        .then(location => {
          if (location.ok) {
            return location.json()
          } else {
            return new Error('Network error');
          }})
        .then(location => {
          this.setState( { city: location.city, isLocationLoading: false } );
          localStorage.setItem(this.localStorageKey, this.state.city);
          this.getWeatherData(location.city, this.state.unit);
        })
        .catch(() => { this.setState( { city: 'Minsk', locationErr: true , isLocationLoading: false} )})
    }
  }

  render() {
    return (
      <Fragment>
        <header className={ css.headerBlock }>
          <div className={ css.container }>
            <Input placeholder={ 'Weather in city' } value={ this.state.newCityInput } onChange={ (e) => this.searchHandler(e.target.value.trim()) }/>
            <div className={ css.info }>
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C3.6 0 0 3.6 0 8C0 13.4 7 19.5 7.3 19.8C7.5 19.9 7.8 20 8 20C8.2 20 8.5 19.9 8.7 19.8C9 19.5 16 13.4 16 8C16 3.6 12.4 0 8 0ZM8 17.7C5.9 15.7 2 11.4 2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 10.1 15.7 8 17.7ZM8 4C5.8 4 4 5.8 4 8C4 10.2 5.8 12 8 12C10.2 12 12 10.2 12 8C12 5.8 10.2 4 8 4ZM8 10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6C9.1 6 10 6.9 10 8C10 9.1 9.1 10 8 10Z" fill="#444"/>
              </svg>
              <p className={css.city}>{ (!this.state.locationErr && !this.state.isLocationLoading) ? this.state.city : 'Not found'  }</p>
              <Dropdown onChange={ (e) => this.toggleUnitsHandler(e.target.value)}/>
            </div>
          </div>
        </header>
        <main>
          <div className={ css.containerWeather }>
            { this.state.weatherErr && <p className={ css.error }>{
              this.state.error === '404' ?
              'The city you are looking for is not found - try changing the query' :
              'An error has occurred, please try again later'
            }</p>}
            { this.state.isWeatherLoading && <div className={css.ldsRing}><div></div></div> }
            { this.state.weatherInfo && !this.state.isWeatherLoading && <Weather weatherInfo={this.state.weatherInfo} unit={ this.state.unit }/>}
          </div>
        </main>
      </Fragment>
    );
  };
}
