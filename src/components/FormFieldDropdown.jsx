import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const calculateBoolean = (booleanVal) => {
    if (booleanVal && booleanVal !== 'false') {
        return 'true'
    }
    return 'false'
}

const creatableSelectHandler = (callback, dropdownEvent, id) => {
    callback({
        target: {
            id,
            value: dropdownEvent.value,
        },
    })
}

const FormFieldDropdown = ({
    title,
    value,
    id,
    onFieldChange,
}) => (
    <>
      <div className={elementStyles.formDropdown}>
        <div className={`d-flex align-items-center ${elementStyles.formDropdownLabel}`}>
            <span>{`${title}:`}</span>
        </div>
        <Select
            className={elementStyles.formDropdownInput}
            onChange={(event) => creatableSelectHandler(onFieldChange, event, id)}
            value={{
                value: calculateBoolean(value),
                label: calculateBoolean(value),
            }}
            options={[{
                value: 'true',
                label: 'true',
             }, {
                value: 'false',
                label: 'false',
             },
            ]}
        />
      </div>
    </>
);
  
export default FormFieldDropdown;
  
FormFieldDropdown.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    onFieldChange: PropTypes.func.isRequired,
};
