import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Redirect } from 'react-router-dom';
import update from 'immutability-helper';
import Select from 'react-select';
import FormField from './FormField';
import FolderCard from './FolderCard';
import LoadingButton from './LoadingButton';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';
import adminStyles from '../styles/isomer-cms/pages/Admin.module.scss';
import { validateCategoryName } from '../utils/validators';
import { toast } from 'react-toastify';
import Toast from './Toast';

const FolderNamingModal = ({
  onClose,
  onProceed,
  folderNameChangeHandler,
  title,
  errors,
}) => {

  return (         
    <div className={elementStyles['modal-newfolder']}>
      <div className={elementStyles.modalHeader}>
        <h1>{`Create new sub folder`}</h1>
        <button id="settings-CLOSE" type="button" onClick={onClose}>
          <i id="settingsIcon-CLOSE" className="bx bx-x" />
        </button>
      </div>
      <div className={elementStyles.modalContent}>
        <div>
          You may edit folder name anytime.
          <br/>
          Choose the pages you would like to group.
        </div>
        <div className={elementStyles.modalFormFields}>
          {/* Title */}
          <FormField
            title="Sub folder name"
            id="subfolder"
            value={title}
            errorMessage={errors}
            isRequired={true}
            onFieldChange={folderNameChangeHandler}
          />
        </div>
        <div className={elementStyles.modalButtons}>
          <LoadingButton
            label="Select Pages"
            disabled={(errors || !title) ? true : false}
            disabledStyle={elementStyles.disabled}
            className={(errors || !title) ? elementStyles.disabled : elementStyles.blue}
            callback={onProceed}
          />
        </div>
      </div>
    </div>
  )
}

export default FolderNamingModal

FolderNamingModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onProceed: PropTypes.func.isRequired,
  folderNameChangeHandler: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  errors: PropTypes.string,
};