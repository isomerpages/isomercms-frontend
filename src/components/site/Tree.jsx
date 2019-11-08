import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import AntTree from './AntTree';
import AtlasTree from './AtlasTree';


export default class SiteTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tree: null,
    };
  }

  async componentDidMount() {
    const { match } = this.props;
    const { siteName } = match.params;

    try {
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/tree`, {
        withCredentials: true,
      });

      const treeData = resp.data;
      this.setState({ treeData });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { match } = this.props;
    const { treeData } = this.state;
    const { siteName } = match.params;
    return (
      <AtlasTree treeData={treeData} />
      // <AntTree treeData={treeData} />
    );
  }
}

SiteTree.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
};
