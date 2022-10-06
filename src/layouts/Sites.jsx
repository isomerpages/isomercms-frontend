import axios from "axios"
import Header from "components/Header"
import _ from "lodash"
import { Component } from "react"
import { Link } from "react-router-dom"

import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import siteStyles from "styles/isomer-cms/pages/Sites.module.scss"

import { convertUtcToTimeDiff } from "utils/dateUtils"

const Sites = ({ siteNames }) => {
  if (siteNames && siteNames.length > 0)
    return siteNames.map((siteName) => (
      <div className={siteStyles.siteContainer} key={siteName.repoName}>
        <div className={siteStyles.site}>
          <Link to={`/sites/${siteName.repoName}/dashboard`}>
            <div className={siteStyles.siteImage} />
            <div className={siteStyles.siteDescription}>
              <div className={siteStyles.siteName}>{siteName.repoName}</div>
              <div className={siteStyles.siteInfo}>
                {convertUtcToTimeDiff(siteName.lastUpdated)}
              </div>
            </div>
          </Link>
        </div>
      </div>
    ))

  if (siteNames && siteNames.length === 0)
    return (
      <div className={siteStyles.infoText}>
        You do not have access to any sites at the moment. Please contact your
        system administrator.
      </div>
    )

  return <div className={siteStyles.infoText}>Loading sites...</div>
}

export default class SitesWrapper extends Component {
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
        `${process.env.REACT_APP_BACKEND_URL_V2}/sites`,
        {
          withCredentials: true,
        }
      )
      const { siteNames } = resp.data

      window.localStorage.setItem(
        LOCAL_STORAGE_KEYS.SitesIsPrivate,
        JSON.stringify(
          siteNames.reduce(
            (map, siteName) =>
              _.set(map, siteName.repoName, siteName.isPrivate),
            {}
          )
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
              <Sites siteNames={siteNames} />
            </div>
          </div>
        </div>
      </>
    )
  }
}
