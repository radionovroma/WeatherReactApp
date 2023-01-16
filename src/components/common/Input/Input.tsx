import { FC, ChangeEvent } from 'react';
import css from './styles.module.css'

interface InputProps {
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Input: FC<InputProps> = ({placeholder, value, onChange}) => {
  return <input className={css.input} value={ value } placeholder={ placeholder } onChange={ onChange }/>
}
