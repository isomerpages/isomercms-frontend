import React from 'react';
import ToggleButton from 'react-toggle-button'

import PropTypes from 'prop-types';

import elementStyles from '@styles/isomer-cms/Elements.module.scss';

const creatableSelectHandler = (callback, dropdownEvent, id) => {
    callback({
        target: {
            id,
            value: dropdownEvent,
        },
    })
}

const FormFieldToggle = ({
    title,
    value,
    id,
    onFieldChange,
}) => (
    <>
      <div className={elementStyles.formToggle}>
        <div className={`d-flex align-items-center ${elementStyles.formToggleLabel}`}>
            <span>{`${title}:`}</span>
        </div>
        <div className={`d-flex align-items-center ${elementStyles.formToggleLabel}`}>
            <ToggleButton
                className={elementStyles.formToggleInput}
                inactiveLabel=""
                activeLabel=""
                thumbIcon={<span className={`bx bx-xs ${value ? `${elementStyles.formToggleThumbIconEnabled} bx-check` : `${elementStyles.formToggleThumbIconDisabled} bx-x`}`}/>}
                value={value}
                onToggle={(value) => creatableSelectHandler(onFieldChange, !value, id)}
            />
        </div>
      </div>
    </>
);
  
export default FormFieldToggle;
  
FormFieldToggle.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    onFieldChange: PropTypes.func.isRequired,
};
