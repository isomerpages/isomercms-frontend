import React, { Component } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Header from "../components/Header"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"
import siteStyles from "../styles/isomer-cms/pages/Sites.module.scss"
import { SITES_IS_PRIVATE_KEY } from "../constants"

export default class Sites extends Component {
  _isMounted = false

  constructor(props) {
    super(props)
    this.state = {
      siteNames: null,
    }
  }

  async componentDidMount() {
    this._isMounted = true
    try {
      const resp = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/sites`,
        {
          withCredentials: true,
        }
      )
      const { siteNames } = resp.data

      window.localStorage.setItem(
        SITES_IS_PRIVATE_KEY,
        JSON.stringify(
          siteNames.reduce((map, siteName) => {
            map[siteName.repoName] = siteName.isPrivate
            return map
          }, {})
        )
      )

      if (this._isMounted) this.setState({ siteNames })
    } catch (err) {
      console.log(err)
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const { siteNames } = this.state
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
              {siteNames && siteNames.length > 0 ? (
                siteNames.map((siteName) => (
                  <div
                    className={siteStyles.siteContainer}
                    key={siteName.repoName}
                  >
                    <div className={siteStyles.site}>
                      <Link to={`/sites/${siteName.repoName}/workspace`}>
                        <div className={siteStyles.siteImage} />
                        <div className={siteStyles.siteDescription}>
                          <div className={siteStyles.siteName}>
                            {siteName.repoName}
                          </div>
                          <div className={siteStyles.siteInfo}>
                            {siteName.lastUpdated}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))
              ) : siteNames && siteNames.length === 0 ? (
                <div className={siteStyles.infoText}>
                  You do not have access to any sites at the moment. Please
                  contact your system administrator.
                </div>
              ) : (
                <div className={siteStyles.infoText}>Loading sites...</div>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }
}
