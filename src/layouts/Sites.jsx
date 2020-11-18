import React, { Component } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import siteStyles from '../styles/isomer-cms/pages/Sites.module.scss';

export default class Sites extends Component {
  _isMounted = false

  constructor(props) {
    super(props);
    this.state = {
      siteNames: [],
    };
  }

  async componentDidMount() {
    this._isMounted = true
    try {
      const resp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites`, {
        withCredentials: true,
      });
      const { siteNames } = resp.data;
      if (this._isMounted) this.setState({ siteNames });
    } catch (err) {
      console.log(err);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const { siteNames } = this.state;
    return (
      <>
        <Header showButton={false} />
        <div className={elementStyles.wrapper}>
          <div className={siteStyles.sitesContainer}>
            <div className={siteStyles.sectionHeader}>
              <div className={siteStyles.sectionTitle}>
                <b>Sites</b>
              </div>
            </div>
            <div className={siteStyles.sites}>
              {siteNames.map((siteName) => (
                <div className={siteStyles.siteContainer} key={siteName.repoName}>
                  <div className={siteStyles.site}>
                    <a href={`/sites/${siteName.repoName}/workspace`}>
                      <div className={siteStyles.siteImage} />
                      <div className={siteStyles.siteDescription}>
                        <div className={siteStyles.siteName}>{siteName.repoName}</div>
                        <div className={siteStyles.siteDate}>{siteName.lastUpdated}</div>
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
}
