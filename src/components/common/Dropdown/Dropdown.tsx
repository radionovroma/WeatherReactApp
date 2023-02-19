import { FC, ChangeEvent} from 'react';
import { Units } from "../../../types/units";
import css from './styles.module.css'

interface DropdownProps {
  value: Units;
  units: {value: Units, label: string, mark: string}[];
  onChange: (e: ChangeEvent<{ value: Units} & HTMLSelectElement >) => void;
}

export const Dropdown: FC<DropdownProps> = ({ value, units, onChange }) => {
  return (
    <select className={ css.dropdown } value={ value } onChange={ onChange }>
      { units.map((unit) => {
        return <option key={unit.value} value={unit.value}>{unit.label}</option>
      })}
    </select>
  );
}
