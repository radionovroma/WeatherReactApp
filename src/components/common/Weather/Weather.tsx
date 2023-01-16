import { FC } from 'react';
import { TWeather} from "../../types/types";
import css from './styles.module.css';

interface WeatherProps {
  weatherInfo: TWeather;
  unit: 'standard' | 'metric' | 'imperial';
}

export const Weather: FC<WeatherProps> = ({weatherInfo, unit}) => {
  return (
    <table className={ css.table }>
      <thead>
      <tr className={ css.cityName }><th>{weatherInfo.name}</th></tr>
      </thead>
      <tbody>
        <tr className={ css.weatherProp }>
          <th className={ css.weatherImg }><img src={`https://openweathermap.org/img/wn/${ weatherInfo.weather[0].icon }@2x.png`} alt={'weather icon'}/></th>
          <th className={ css.weatherTemp }>{weatherInfo.main.temp}{unit === 'metric' ? ' °C' : unit === 'imperial' ? ' °F' : ' K'}</th>
        </tr>
        <tr className={ css.weatherProp }>
          <th>Feels like</th>
          <th>{weatherInfo.main['feels_like']}{unit === 'metric' ? ' °C. ' : unit === 'imperial' ? ' °F. ' : ' K. '}</th>
          <th>{weatherInfo.weather[0].description[0].toUpperCase() + weatherInfo.weather[0].description.slice(1)}</th>
        </tr>
        <tr className={ css.weatherProp }>
          <th>Pressure:</th>
          <th>{weatherInfo.main.pressure}</th>
        </tr>
        <tr className={ css.weatherProp }>
          <th>Humidity:</th>
          <th>{weatherInfo.main.humidity}</th>
        </tr>
      </tbody>
    </table>
  );
}
