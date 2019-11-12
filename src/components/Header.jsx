import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Base64 } from 'js-base64';
import {
  prettifyPageFileName, frontMatterParser, concatFrontMatterMdBody, generatePageFileName,
} from '../utils';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  async componentDidMount() {
    try {

    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <div className="header">
        <div className="header-left">
          <a href="/sites"><button><i className='bx bx-chevron-left'></i>Back to Sites</button></a>
        </div>
        <div className="header-center">
          <div className="logo">
            <img src={process.env.PUBLIC_URL + '/img/logo.svg'}/>
          </div>
        </div>
        <div className="header-right">
          <button className="blue">
            Log Out
          </button>
        </div>
      </div>
    );
  }
}
