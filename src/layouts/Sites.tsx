import {
  Divider,
  LinkBox,
  LinkOverlay,
  HStack,
  Text,
  VStack,
  Flex,
} from "@chakra-ui/react"
import { InlineMessage } from "@opengovsg/design-system-react"
import _ from "lodash"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { AllSitesHeader } from "components/Header/AllSitesHeader"

import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import { useLoginContext } from "contexts/LoginContext"

import { useGetAllSites } from "hooks/allSitesHooks"
import { useAnnouncements } from "hooks/useAnnouncement"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import siteStyles from "styles/isomer-cms/pages/Sites.module.scss"

import { convertUtcToTimeDiff } from "utils/dateUtils"

import { EmptySitesImage, IsomerLogoNoText } from "assets"
import { AnnouncementModal } from "features/AnnouncementModal/AnnouncementModal"
import { SiteData } from "types/sites"

const SitesContent = ({ siteNames }: { siteNames?: SiteData[] }) => {
  const { userId } = useLoginContext()
  const isEmailLoginUser = !userId
  const urlLink = isEmailLoginUser ? "dashboard" : "workspace"

  if (!siteNames)
    return <div className={siteStyles.infoText}>Loading sites...</div>
  if (siteNames.length === 0)
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
  return (
    <>
      {siteNames.map((siteName) => (
        <div className={siteStyles.siteContainer} key={siteName.repoName}>
          <div className={siteStyles.site}>
            <Link to={`/sites/${siteName.repoName}/${urlLink}`}>
              <Flex
                w="full"
                h="70%"
                justifyContent="center"
                alignItems="center"
              >
                <IsomerLogoNoText height="30%" />
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
                <Text fontSize="0.9em">{siteName.repoName}</Text>
                {siteName.lastUpdated && (
                  <Text fontSize="0.6em" color="base.content.light">
                    {convertUtcToTimeDiff(siteName.lastUpdated)}
                  </Text>
                )}
              </VStack>
            </Link>
          </div>
        </div>
      ))}
    </>
  )
}

export const Sites = (): JSX.Element => {
  const { email, userId } = useLoginContext()
  const { data: siteRequestData } = useGetAllSites(email)
  const { announcements, link } = useAnnouncements()
  const [isOpen, setIsOpen] = useState(announcements.length > 0 && !userId)
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

  return (
    <>
      {announcements.length > 0 && (
        <AnnouncementModal
          isOpen={isOpen}
          announcements={announcements}
          link={link}
          onClose={() => setIsOpen(false)}
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
