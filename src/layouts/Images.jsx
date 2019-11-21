import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

export default class Images extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      newImageName: '',
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images`, {
        withCredentials: true,
      });
      const { images } = resp.data;
      this.setState({ images });
    } catch (err) {
      console.log(err);
    }
  }

  updateNewPageName = (event) => {
    event.preventDefault();
  }

  uploadImage = async (imageName, imageContent) => {
    try {
      const { match } = this.props;
      const { siteName } = match.params;
      const params = {
        imageName,
        content: imageContent,
      };

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/images`, params, {
        withCredentials: true,
      });

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  onImageSelect = async (event) => {
    const imgReader = new FileReader();
    imgReader.imgName = event.target.files[0].name;
    imgReader.onload = () => {
      /** Github only requires the content of the image
       * imgReader returns  `data:image/png;base64, {fileContent}`
       * hence the split
       */

      const imgData = imgReader.result.split(',')[1];

      const { imgName } = imgReader;

      this.setState({ newImageName: imgName, newImageContent: imgData });

      // TODO
      // this.uploadImage(imgName, imgData)
    };
    imgReader.readAsDataURL(event.target.files[0]);
  }

  render() {
    const { images, newImageName, newImageContent } = this.state;
    const { match } = this.props;
    const { siteName } = match.params;
    return (
      <div>
        <Link to="/sites">Back to Sites</Link>
        <hr />
        <h2>{siteName}</h2>
        <ul>
          <li>
            <Link to={`/sites/${siteName}/pages`}>Pages</Link>
          </li>
          <li>
            <Link to={`/sites/${siteName}/collections`}>Collections</Link>
          </li>
          <li>
            <Link to={`/sites/${siteName}/images`}>Images</Link>
          </li>
          <li>
            <Link to={`/sites/${siteName}/files`}>Files</Link>
          </li>
          <li>
            <Link to={`/sites/${siteName}/menus`}>Menus</Link>
          </li>
        </ul>
        <hr />
        <h3>Images</h3>
        {images.length > 0
          ? images.map((image) => (
            <li key={image.fileName}>
              <Link to={`/sites/${siteName}/images/${image.fileName}`}>{image.fileName}</Link>
            </li>
          ))
          : 'No images'}
        <br />

        <div className="d-flex">
          <input
            type="file"
            onChange={this.onImageSelect}
            accept="image/png, image/jpeg"
          />
          {
            newImageContent
              ? <img alt="" src={`data:image/jpeg;base64,${newImageContent}`} />
              : null
          }
        </div>

        <button type="button" onClick={() => this.uploadImage(newImageName, newImageContent)}>Upload new image</button>
      </div>
    );
  }
}

Images.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
};
