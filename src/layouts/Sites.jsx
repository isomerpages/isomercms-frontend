import {
  LinkBox,
  LinkOverlay,
  HStack,
  Text,
  VStack,
  Flex,
} from "@chakra-ui/react"
import { InlineMessage } from "@opengovsg/design-system-react"
import axios from "axios"
import { AllSitesHeader } from "components/Header/AllSitesHeader"
import _ from "lodash"
import { Component } from "react"
import { Link } from "react-router-dom"

import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import { useLoginContext } from "contexts/LoginContext"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import siteStyles from "styles/isomer-cms/pages/Sites.module.scss"

import { convertUtcToTimeDiff } from "utils/dateUtils"

import { EmptySitesImage, OGPLogoNoText } from "assets"

const Sites = ({ siteNames }) => {
  const { userId } = useLoginContext()
  const isEmailLoginUser = !userId
  const urlLink = isEmailLoginUser ? "dashboard" : "workspace"

  if (siteNames && siteNames.length > 0)
    return siteNames.map((siteName) => (
      <div className={siteStyles.siteContainer} key={siteName.repoName}>
        <div className={siteStyles.site}>
          <Link to={`/sites/${siteName.repoName}/${urlLink}`}>
            <Flex w="full" h="70%" justifyContent="center" alignItems="center">
              <OGPLogoNoText height="30%" />
            </Flex>
            <VStack
              w="full"
              h="30%"
              justifyContent="center"
              alignItems="start"
              backgroundColor="interaction.mainLight.default"
              pl="1rem"
              borderRadius="0px 0px 4px 4px"
            >
              <Text fontSize="0.9em">{siteName.repoName}</Text>
              <Text fontSize="0.6em" color="base.content.light">
                {convertUtcToTimeDiff(siteName.lastUpdated)}
              </Text>
            </VStack>
          </Link>
        </div>
      </div>
    ))

  if (siteNames && siteNames.length === 0)
    return (
      <VStack pt="2.5rem" w="full" gap="4rem">
        <InlineMessage variant="warning" w="full">
          {`If your sites aren’t showing, please try logging in with your ${
            isEmailLoginUser ? "GitHub ID" : "email"
          } for now.`}
        </InlineMessage>
        <EmptySitesImage />
        <VStack gap="2rem" color="base.content.default">
          <VStack spacing="0">
            <Text fontWeight={500} color="base.content.dark">
              You’ve not been added as a collaborator to any Isomer site yet.
            </Text>
            <Text>Get a colleague to add you as a collaborator.</Text>
          </VStack>
          <HStack>
            <Text>Any question? Contact us at</Text>
            <LinkBox ml="0">
              <LinkOverlay href="mailto:support@isomer.gov.sg" isExternal>
                <Text as="u">support@isomer.gov.sg</Text>
              </LinkOverlay>
            </LinkBox>
          </HStack>
        </VStack>
      </VStack>
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
        <AllSitesHeader />
        <div className={elementStyles.wrapper}>
          <div className={siteStyles.sitesContainer}>
            <div className={siteStyles.sectionHeader}>
              <div className={siteStyles.sectionTitle}>
                <Text color="base.content.dark" as="strong">
                  My Sites
                </Text>
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
