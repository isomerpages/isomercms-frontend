import React from 'react';
import PropTypes from 'prop-types';
import ToggleButton from 'react-toggle-button'
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

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
      <div className={elementStyles.formHorizontal}>
        <div className={`d-flex align-items-center ${elementStyles.formHorizontalLabel}`}>
            <span>{`${title}:`}</span>
        </div>
        <div className={`d-flex align-items-center ${elementStyles.formHorizontalLabel}`}>
            <ToggleButton
                className={elementStyles.formHorizontalInput}
                inactiveLabel={''}
                activeLabel={''}
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
    value: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    onFieldChange: PropTypes.func.isRequired,
};
