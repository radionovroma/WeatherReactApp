import { FC } from 'react';
import { useSelector } from 'react-redux';
import { getWeather } from '../../store/weather';
import { Units } from '../../types/units';
import css from './styles.module.css';

interface WeatherProps {
  unit: Units;
  units: { value: Units, label: string, mark: string }[]
}

export const Weather: FC<WeatherProps> = ({unit, units}) => {

  const weather = useSelector(getWeather);

  const mark = units.find(item => item.value === unit)!.mark;

  if (weather === null) {
    return null;
  } else {
    return (
      <table className={ css.table }>
        <thead>
        <tr className={ css.cityName }><th>{weather.name}</th></tr>
        </thead>
        <tbody>
        <tr className={ css.row }>
          <th className={ css.weatherImg }><img src={`https://openweathermap.org/img/wn/${ weather.weather[0].icon }@2x.png`} alt={'weather icon'}/></th>
          <th className={ css.weatherTemp }>{weather.main.temp} { mark }</th>
        </tr>
        <tr className={ css.row}>
          <th>Feels like</th>
          <th>{weather.main.feels_like} { mark }</th>
          <th>{weather.weather[0].description[0].toUpperCase() + weather.weather[0].description.slice(1)}</th>
        </tr>
        <tr className={ css.row }>
          <th>Pressure:</th>
          <th>{weather.main.pressure}</th>
        </tr>
        <tr className={ css.row }>
          <th>Humidity:</th>
          <th>{weather.main.humidity}</th>
        </tr>
        </tbody>
      </table>
    );
  }
}
