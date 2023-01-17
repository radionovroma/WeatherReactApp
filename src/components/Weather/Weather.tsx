import { FC } from 'react';
import { TWeather, Units} from "../types/types";
import css from './styles.module.css';

interface WeatherProps {
  weatherInfo: TWeather;
  unit: Units;
  units: { value: Units, label: string, mark: string }[]
}

export const Weather: FC<WeatherProps> = ({weatherInfo, unit, units}) => {
  const mark = units.find(item => item.value === unit)!.mark;
  return (
    <table className={ css.table }>
      <thead>
      <tr className={ css.cityName }><th>{weatherInfo.name}</th></tr>
      </thead>
      <tbody>
        <tr className={ css.row }>
          <th className={ css.weatherImg }><img src={`https://openweathermap.org/img/wn/${ weatherInfo.weather[0].icon }@2x.png`} alt={'weather icon'}/></th>
          <th className={ css.weatherTemp }>{weatherInfo.main.temp} { mark }</th>
        </tr>
        <tr className={ css.row}>
          <th>Feels like</th>
          <th>{weatherInfo.main.feels_like} { mark }</th>
          <th>{weatherInfo.weather[0].description[0].toUpperCase() + weatherInfo.weather[0].description.slice(1)}</th>
        </tr>
        <tr className={ css.row }>
          <th>Pressure:</th>
          <th>{weatherInfo.main.pressure}</th>
        </tr>
        <tr className={ css.row }>
          <th>Humidity:</th>
          <th>{weatherInfo.main.humidity}</th>
        </tr>
      </tbody>
    </table>
  );
}
