import { FC, ChangeEvent} from 'react';
import { Units } from "../../types/types";
import css from './styles.module.css'
interface ButtonProps {
  onChange: (e: ChangeEvent<{ value: Units} & HTMLSelectElement >) => void;
}

export const Dropdown: FC<ButtonProps> = ({ onChange}) => {
  return (
    <select className={ css.dropdown } onChange={ onChange }>
      <option value="metric">Metric, °C</option>
      <option value="imperial">Imperial, °F</option>
      <option value="standard">Standard, K</option>
    </select>
  );
}
