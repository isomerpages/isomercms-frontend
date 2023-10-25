import {
  Divider,
  LinkBox,
  LinkOverlay,
  HStack,
  Text,
  VStack,
  Flex,
  Image,
} from "@chakra-ui/react"
import { useFeatureIsOn } from "@growthbook/growthbook-react"
import { Infobox } from "@opengovsg/design-system-react"
import _ from "lodash"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { AllSitesHeader } from "components/Header/AllSitesHeader"

import { FEATURE_FLAGS } from "constants/featureFlags"
import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import { useLoginContext } from "contexts/LoginContext"

import { useGetAllSites, useSitePreview } from "hooks/allSitesHooks"
import { useAnnouncements } from "hooks/useAnnouncement"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import siteStyles from "styles/isomer-cms/pages/Sites.module.scss"

import { convertUtcToTimeDiff } from "utils/dateUtils"

import { EmptySitesImage, IsomerLogoNoText } from "assets"
import { AnnouncementModal } from "features/AnnouncementModal/AnnouncementModal"
import { SiteData } from "types/sites"
import { UserTypes } from "types/user"

const SitePreviewImage = ({ imageUrl }: { imageUrl?: string }) => {
  return (
    <Image
      src={imageUrl}
      height="50%"
      fallback={<IsomerLogoNoText height="50%" />}
    />
  )
}

const SitesCard = (
  repoName: string,
  lastUpdated: string,
  urlLink: "dashboard" | "workspace",
  imageUrl?: string
) => {
  return (
    <div className={siteStyles.siteContainer} key={repoName}>
      <div className={siteStyles.site}>
        <Link to={`/sites/${repoName}/${urlLink}`}>
          <Flex w="full" h="70%" justifyContent="center" alignItems="center">
            <SitePreviewImage imageUrl={imageUrl} />
          </Flex>
          <Divider />
          <VStack
            w="full"
            h="30%"
            justifyContent="center"
            alignItems="start"
            backgroundColor="interaction.mainLight.default"
            pl="1rem"
            borderRadius="0px 0px 4px 4px"
          >
            <Text fontSize="0.9em">{repoName}</Text>
            {lastUpdated && (
              <Text fontSize="0.6em" color="base.content.light">
                Updated {convertUtcToTimeDiff(lastUpdated)}
              </Text>
            )}
          </VStack>
        </Link>
      </div>
    </div>
  )
}

const SitesContent = ({ siteNames }: { siteNames?: SiteData[] }) => {
  const { userId, email } = useLoginContext()
  const isEmailLoginUser = !userId
  const urlLink = isEmailLoginUser ? "dashboard" : "workspace"

  if (!siteNames)
    return <div className={siteStyles.infoText}>Loading sites...</div>
  if (siteNames.length === 0)
    return (
      <VStack pt="2.5rem" w="full" gap="4rem">
        <Infobox variant="warning" w="full">
          {`If your sites aren’t showing, please try logging in with your ${
            isEmailLoginUser ? "GitHub ID" : "email"
          } for now.`}
        </Infobox>
        <EmptySitesImage />
        <VStack gap="2rem" color="base.content.default">
          <VStack spacing="0">
            <Text fontWeight={500} color="base.content.dark">
              You’ve not been added as a collaborator to any Isomer site yet.
            </Text>
            <Text>Get a colleague to add you as a collaborator.</Text>
          </VStack>
          <HStack>
            <Text>Any questions? Contact us at</Text>
            <LinkBox ml="0">
              <LinkOverlay href="mailto:support@isomer.gov.sg" isExternal>
                <Text as="u">support@isomer.gov.sg</Text>
              </LinkOverlay>
            </LinkBox>
          </HStack>
        </VStack>
      </VStack>
    )
  const { data: previews } = useSitePreview(
    email,
    siteNames.map((site) => site.repoName)
  )
  if (previews && previews.length === siteNames.length) {
    const sitesWithPreview = siteNames.map((siteName, index) => {
      return {
        ...siteName,
        imageUrl: previews[index].imageUrl,
      }
    })
    return (
      <>
        {sitesWithPreview.map(({ repoName, lastUpdated, imageUrl }) =>
          SitesCard(repoName, lastUpdated, urlLink, imageUrl)
        )}
      </>
    )
  }
  return (
    <>
      {siteNames.map(({ repoName, lastUpdated }) =>
        SitesCard(repoName, lastUpdated, urlLink)
      )}
    </>
  )
}

export const Sites = (): JSX.Element => {
  const { email, userId, contactNumber, userType } = useLoginContext()
  const { data: siteRequestData } = useGetAllSites(email)
  const { announcements, link, onCloseButtonText } = useAnnouncements()
  const [isOpen, setIsOpen] = useState(announcements.length > 0)

  useEffect(() => {
    if (!siteRequestData) return
    const siteData = siteRequestData.siteNames
    window.localStorage.setItem(
      LOCAL_STORAGE_KEYS.SitesIsPrivate,
      JSON.stringify(
        siteData.reduce(
          (map, siteName: SiteData) =>
            _.set(map, siteName.repoName, siteName.isPrivate),
          {}
        )
      )
    )
  }, [siteRequestData])

  const showNewLayouts = useFeatureIsOn(FEATURE_FLAGS.HOMEPAGE_TEMPLATES)
  const isGithubUser = userType === UserTypes.Github
  /**
   * Currently the announcement modal takes in all the keyboard events,
   * thus preventing the user from typing in the verify otp input field.
   */
  const shouldShowAnnouncementModel =
    announcements.length > 0 &&
    !!contactNumber &&
    !!email &&
    (showNewLayouts || isGithubUser)

  return (
    <>
      {shouldShowAnnouncementModel && (
        <AnnouncementModal
          isOpen={isOpen}
          announcements={announcements}
          link={link}
          onClose={() => setIsOpen(false)}
          onCloseButtonText={onCloseButtonText}
        />
      )}
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
            <SitesContent siteNames={siteRequestData?.siteNames} />
          </div>
        </div>
      </div>
    </>
  )
}
