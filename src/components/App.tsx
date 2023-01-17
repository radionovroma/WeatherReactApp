import { Component, Fragment } from 'react';
import debounce from 'lodash/debounce';
import { Input, Dropdown } from "./common";
import { Weather } from "./Weather";
import { TWeather, Units } from "./types/types";
import css from './styles.module.css';

enum LOAD_STATUSES {
  LOADED = 'loaded',
  LOADING = 'loading',
  ERROR = 'error',
  INITIAL = 'initial',
}

interface AppState {
  city: string;
  newCityInput: string;
  locationLoadStatus: LOAD_STATUSES;
  unit: Units;
  units: { value: Units, label: string, mark: string }[];
  weatherInfo: TWeather | null;
  weatherLoadStatus: LOAD_STATUSES;
  weatherErrorCod: number | null;

}

export class App extends Component<{}, AppState> {
  state: AppState = {
    city: '',
    newCityInput: '',
    locationLoadStatus: LOAD_STATUSES.INITIAL,
    unit: 'metric',
    units: [
      { value: 'metric', label: 'Metric, °C', mark: '°C'},
      { value: 'imperial', label: 'Imperial, °F', mark: '°F'},
      { value: 'standard', label: 'Standard, K', mark: 'K'},
    ],
    weatherInfo: null,
    weatherLoadStatus: LOAD_STATUSES.INITIAL,
    weatherErrorCod: null,
  };

  localStorageKey = 'city';

  fetchData = (url: string, request: 'weather' | 'location') => {
    return fetch(url)
      .then(data => {
        if (data.ok) {
         return data.json()
        } else {
         if ( request === 'weather') {
           this.setState({ weatherErrorCod: data.status});
         }
         throw new Error('Network err');
        }
      });
  };

  debouncedSearch = debounce((newCityInput: AppState['newCityInput']) => {
    this.getWeatherData(newCityInput || this.state.city, this.state.unit);
  }, 1500);

  getWeatherData = (city: AppState['city'], unit: AppState['unit']) => {
    let urlParams = new URLSearchParams({ q: city, appid: `${process.env.REACT_APP_APPID}`, units: unit }).toString();
    this.fetchData(`https://api.openweathermap.org/data/2.5/weather?${urlParams}`, 'weather')
      .then(weatherInfo => {
        this.setState( { weatherInfo, weatherLoadStatus: LOAD_STATUSES.LOADED} )
      })
      .catch(() => {
        this.setState( { weatherLoadStatus: LOAD_STATUSES.ERROR, weatherInfo: null})
      })
  };

  componentDidMount() {
    const city = localStorage.getItem(this.localStorageKey) ?? '';
    if (city.length) {
      this.setState({ city });
      this.getWeatherData(city, this.state.unit);
    }
    if (this.state.city === '' && this.state.locationLoadStatus === LOAD_STATUSES.INITIAL){
      this.fetchData('http://ip-api.com/json/', 'location')
        .then(location => {
          this.setState( { city: location.city, locationLoadStatus: LOAD_STATUSES.LOADED } );
          localStorage.setItem(this.localStorageKey, location.city);
          this.getWeatherData(location.city, this.state.unit);
        })
        .catch(() => {
          this.setState( { city: 'Minsk', locationLoadStatus: LOAD_STATUSES.ERROR} )
        });
    }
  };

  componentDidUpdate(prevProps: any, prevState: AppState) {
    if (prevState.newCityInput !== this.state.newCityInput){
      this.setState({ weatherLoadStatus: LOAD_STATUSES.LOADING, weatherErrorCod: null });
      this.debouncedSearch(this.state.newCityInput);
    }
    if (prevState.unit !== this.state.unit){
      this.setState({ weatherLoadStatus: LOAD_STATUSES.LOADING, weatherErrorCod: null });
      this.getWeatherData(this.state.newCityInput || this.state.city, this.state.unit);
    }
  };

  render() {
    return (
      <Fragment>
        <header className={ css.headerBlock }>
          <div className={ css.container }>
            <Input
              placeholder='Weather in city'
              value={ this.state.newCityInput }
              onChange={ (e) => this.setState({ newCityInput: e.target.value.trim() })}
            />
            <div className={ css.info }>
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 0C3.6 0 0 3.6 0 8C0 13.4 7 19.5 7.3 19.8C7.5 19.9 7.8 20 8 20C8.2 20 8.5 19.9 8.7 19.8C9 19.5 16 13.4 16 8C16 3.6 12.4 0 8 0ZM8 17.7C5.9 15.7 2 11.4 2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 10.1 15.7 8 17.7ZM8 4C5.8 4 4 5.8 4 8C4 10.2 5.8 12 8 12C10.2 12 12 10.2 12 8C12 5.8 10.2 4 8 4ZM8 10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6C9.1 6 10 6.9 10 8C10 9.1 9.1 10 8 10Z" fill="#444"/>
              </svg>
              <p className={css.city}>
                { this.state.locationLoadStatus === LOAD_STATUSES.LOADED ? this.state.city : 'Not found'  }
              </p>
              <Dropdown
                value={this.state.unit}
                units={this.state.units}
                onChange={ (e) => this.setState({ unit: e.target.value })}
              />
            </div>
          </div>
        </header>
        <main>
          <div className={ css.containerWeather }>
            { this.state.weatherLoadStatus === LOAD_STATUSES.ERROR &&
              <p className={ css.error }>
                {this.state.weatherErrorCod === 404 ?
                  'The city you are looking for is not found - try changing the query' :
                  'An error has occurred, please try again later'}
              </p>
            }
            { (this.state.weatherLoadStatus === LOAD_STATUSES.LOADING || this.state.weatherLoadStatus === LOAD_STATUSES.INITIAL) &&
              <div className={css.ldsRing}><div></div></div>
            }
            { this.state.weatherLoadStatus === LOAD_STATUSES.LOADED &&
              this.state.weatherInfo !== null &&
              <Weather
                weatherInfo={this.state.weatherInfo}
                unit={ this.state.unit }
                units={ this.state.units }
              />
            }
          </div>
        </main>
      </Fragment>
    );
  };
}
