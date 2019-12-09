import React, { Component } from 'react';
import axios from 'axios';
import mediaStyles from '../styles/isomer-cms/pages/Media.module.scss';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import FormField from './FormField';
import { validateFileName } from '../utils/validators';


export default class EditImagesModal extends Component {
  constructor(props) {
    super(props);
    const { image: { fileName } } = props;
    this.state = {
      newFileName: fileName,
      sha: '',
      content: null,
    };
  }

  async componentDidMount() {
    const { match, image: { fileName } } = this.props;
    const { siteName } = match.params;
    const { data: { sha, content } } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images/${fileName}`, {
      withCredentials: true,
    });
    this.setState({ sha, content });
  }

  setFileName = (e) => {
    this.setState({ newFileName: e.target.value });
  }

  renameImage = async () => {
    const { match, image: { fileName } } = this.props;
    const { siteName } = match.params;
    const { newFileName, sha, content } = this.state;
    const params = {
      sha,
      content,
    };
    console.log(newFileName, fileName);

    if (newFileName === fileName) {
      return;
    }
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images/${fileName}/rename/${newFileName}`, params, {
      withCredentials: true,
    });

    window.location.reload();
  }

  deleteImage = async () => {
    try {
      const { match, image: { fileName } } = this.props;
      const { siteName } = match.params;
      const { sha } = this.state;
      const params = {
        sha,
      };

      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images/${fileName}`, {
        data: params,
        withCredentials: true,
      });

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { match, onClose, image } = this.props;
    const { siteName } = match.params;
    const { newFileName, sha } = this.state;
    const errorMessage = validateFileName(newFileName);

    return (
      <div className={elementStyles.overlay}>
        <div className={elementStyles.modal}>
          <div className={elementStyles.modalHeader}>
            <h1>Edit Image</h1>
            <button type="button" onClick={onClose}>
              <i className="bx bx-x" />
            </button>
          </div>
          <div className={mediaStyles.editMediaPreview}>
            <img
              alt={`${image.fileName}`}
              src={`https://raw.githubusercontent.com/isomerpages/${siteName}/staging/${image.path}`}
            />
          </div>
          <form className={elementStyles.modalContent}>
            <div className={elementStyles.modalFormFields}>
              <FormField
                title="Image name"
                value={newFileName}
                errorMessage={errorMessage}
                isRequired
                onFieldChange={this.setFileName}
              />
            </div>
            <div className={elementStyles.modalButtons}>
              <button type="button" className={errorMessage ? elementStyles.disabled : elementStyles.blue} disabled={!!errorMessage} onClick={this.renameImage}>Save</button>
              <button type="button" className={sha ? elementStyles.warning : elementStyles.disabled} onClick={this.deleteImage} disabled={!sha}>Delete</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
