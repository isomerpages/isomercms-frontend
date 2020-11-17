import React from 'react';
import { slugifyLower } from '../utils';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const Dropdown = ({ options, defaultOption, emptyDefault, id, onFieldChange }) => (
  <select 
  className={`${elementStyles.form} ${elementStyles.formHorizontal} ${elementStyles.formHorizontalInput}`} 
  id={id} 
  onChange={(e) => onFieldChange(e.target.value)} 
  >
    { defaultOption &&
      <option value={ emptyDefault ? '' : slugifyLower(defaultOption) }>{ defaultOption }</option>
    }
    { options.map((option) => {
      if (option === defaultOption) return // skip option if already included in default option
      return <option value={ slugifyLower(option) }>{ option }</option>
    })}
  </select>
);

export default Dropdown;