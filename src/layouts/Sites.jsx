import { Link as ChakraLink } from "@chakra-ui/react"
import { ThemeProvider } from "@opengovsg/design-system-react"
import axios from "axios"
import Banner from "components/Banner"
import Header from "components/Header"
import _ from "lodash"
import { Component } from "react"
import { Link } from "react-router-dom"

import { SITES_IS_PRIVATE_KEY } from "constants/constants"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import siteStyles from "styles/isomer-cms/pages/Sites.module.scss"

const Site = ({ siteNames }) => {
  if (siteNames && siteNames.length > 0)
    return siteNames.map((siteName) => (
      <div className={siteStyles.siteContainer} key={siteName.repoName}>
        <div className={siteStyles.site}>
          <Link to={`/sites/${siteName.repoName}/workspace`}>
            <div className={siteStyles.siteImage} />
            <div className={siteStyles.siteDescription}>
              <div className={siteStyles.siteName}>{siteName.repoName}</div>
              <div className={siteStyles.siteInfo}>{siteName.lastUpdated}</div>
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
        {/* TODO: Move ThemeProvider to root of app during design system refactor. 
        Refer to issue: https://github.com/isomerpages/isomercms-frontend/issues/782 */}
        <ThemeProvider>
          <Banner>
            From 31 Mar 2022, all users will have to use an agency-issued email
            to verify their account before making new edits in the CMS. &nbsp;
            <ChakraLink
              color="white"
              href="https://go.gov.sg/isomer-identity"
              isExternal
            >
              Read more
            </ChakraLink>
          </Banner>
        </ThemeProvider>
        <Header showButton={false} />
        <div className={elementStyles.wrapper}>
          <div className={siteStyles.sitesContainer}>
            <div className={siteStyles.sectionHeader}>
              <div className={siteStyles.sectionTitle}>
                <b>Sites</b>
              </div>
            </div>
            <div className={siteStyles.sites}>
              <Site siteNames={siteNames} />
            </div>
          </div>
        </div>
      </>
    )
  }
}
