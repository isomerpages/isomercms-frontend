import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Skeleton,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { Button, Link } from "@opengovsg/design-system-react"
import { ButtonLink } from "components/ButtonLink"
import { CollaboratorModal } from "components/CollaboratorModal"
import {
  DisplayCard,
  DisplayCardCaption,
  DisplayCardContent,
  DisplayCardHeader,
  DisplayCardTitle,
} from "components/DisplayCard"
import {
  MenuDropdownButton,
  MenuDropdownItem,
} from "components/MenuDropdownButton"
import _ from "lodash"
import { useEffect } from "react"
import { BiCheckCircle, BiCog, BiEditAlt, BiGroup } from "react-icons/bi"
import { useParams, Link as RouterLink } from "react-router-dom"

import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import { useLoginContext } from "contexts/LoginContext"
import { useSiteLaunchContext } from "contexts/SiteLaunchContext"

import {
  useGetSiteInfo,
  useGetReviewRequests,
  useGetCollaboratorsStatistics,
  useUpdateViewedReviewRequests,
} from "hooks/siteDashboardHooks"
import useRedirectHook from "hooks/useRedirectHook"

import { getDateTimeFromUnixTime } from "utils/date"
import { shouldUseSiteLaunchFeature } from "utils/siteLaunchUtils"

import { BxsClearRocket, SiteDashboardHumanImage } from "assets"
import { FeatureTourHandler } from "features/FeatureTour/FeatureTour"
import { DASHBOARD_FEATURE_STEPS } from "features/FeatureTour/FeatureTourSequence"
import {
  SiteLaunchFrontEndStatus,
  SITE_LAUNCH_TASKS_LENGTH,
} from "types/siteLaunch"

import { SiteViewLayout } from "../layouts"

import { CollaboratorsStatistics } from "./components/CollaboratorsStatistics"
import { EmptyReviewRequest } from "./components/EmptyReviewRequest"
import { ReviewRequestCard } from "./components/ReviewRequestCard"

interface SiteLaunchDisplayCardProps {
  siteName: string
  siteLaunchStatus?: SiteLaunchFrontEndStatus
  isSiteLaunchLoading: boolean
  siteLaunchChecklistStepNumber?: number
}

export const SiteDashboard = (): JSX.Element => {
  const {
    isOpen: isCollaboratorsModalOpen,
    onOpen: onCollaboratorsModalOpen,
    onClose: onCollaboratorsModalClose,
  } = useDisclosure()
  const { siteName } = useParams<{ siteName: string }>()
  const { setRedirectToPage } = useRedirectHook()
  const { userId } = useLoginContext()
  const { siteLaunchStatusProps } = useSiteLaunchContext()
  const {
    data: siteInfo,
    isError: isSiteInfoError,
    isLoading: isSiteInfoLoading,
  } = useGetSiteInfo(siteName)
  const {
    data: reviewRequests,
    isError: isReviewRequestsError,
    isLoading: isReviewRequestsLoading,
  } = useGetReviewRequests(siteName)
  const {
    data: collaboratorsStatistics,
    isError: isCollaboratorsStatisticsError,
    isLoading: isCollaboratorsStatisticsLoading,
  } = useGetCollaboratorsStatistics(siteName)
  const {
    mutateAsync: updateViewedReviewRequests,
  } = useUpdateViewedReviewRequests()

  const savedAt = getDateTimeFromUnixTime(siteInfo?.savedAt || 0)
  const publishedAt = getDateTimeFromUnixTime(siteInfo?.publishedAt || 0)

  useEffect(() => {
    // GitHub users should not be able to access this page
    if (userId !== "Unknown user" && !!userId) {
      setRedirectToPage(`/sites/${siteName}/workspace`)
    }
  }, [setRedirectToPage, siteName, userId])

  useEffect(() => {
    updateViewedReviewRequests({ siteName })
  }, [siteName, updateViewedReviewRequests])

  const validReviewRequests = reviewRequests?.filter(
    ({ status }) => status === "OPEN" || status === "APPROVED"
  )
  const siteLaunchStatus = siteLaunchStatusProps?.siteLaunchStatus
  const isSiteLaunchLoading = siteLaunchStatus === "LOADING"
  return (
    <SiteViewLayout overflow="hidden">
      <Container maxW="container.xl" minH="100vh">
        {/* Heading section */}
        <Flex px="4rem">
          <Heading as="h2" noOfLines={1} w="70%">
            {siteName}
          </Heading>
          <Spacer />
          <HStack spacing="1.25rem" id="isomer-dashboard-feature-tour-step-1">
            <MenuDropdownButton
              variant="outline"
              mainButtonText="Open staging"
              isDisabled={isSiteInfoLoading || isSiteInfoError}
              as={ButtonLink}
              href={siteInfo?.stagingUrl}
            >
              <MenuDropdownItem
                as={ButtonLink}
                href={siteInfo?.stagingUrl}
                isDisabled={isSiteInfoLoading || isSiteInfoError}
              >
                <Text textStyle="body-1" fill="text.body">
                  Open staging site
                </Text>
              </MenuDropdownItem>
              <MenuDropdownItem
                as={ButtonLink}
                href={siteInfo?.siteUrl}
                isDisabled={isSiteInfoLoading || isSiteInfoError}
              >
                <Text textStyle="body-1" fill="text.body">
                  Visit live site
                </Text>
              </MenuDropdownItem>
            </MenuDropdownButton>
            <Button
              as={RouterLink}
              isLoading={isReviewRequestsLoading}
              isDisabled={_.some(
                validReviewRequests,
                ({ status }) => status === "APPROVED"
              )}
              to={`/sites/${siteName}/workspace`}
              leftIcon={
                <Icon as={BiEditAlt} fontSize="1.35rem" color="white" />
              }
            >
              <Text color="white">Edit site</Text>
            </Button>
          </HStack>
        </Flex>

        {/* Content */}
        <Flex px="4rem" pt="1.25rem" gap="0.5rem">
          <FeatureTourHandler
            localStorageKey={LOCAL_STORAGE_KEYS.DashboardFeatureTour}
            steps={DASHBOARD_FEATURE_STEPS}
          />
          {/* Left column */}
          <Box w="60%" id="isomer-dashboard-feature-tour-step-2">
            <DisplayCard variant="full">
              <DisplayCardHeader>
                <DisplayCardTitle
                  icon={<Icon as={BiCheckCircle} fontSize="1.5rem" />}
                >
                  Pending reviews
                </DisplayCardTitle>
                <DisplayCardCaption>
                  Changes to be approved before they can be published
                </DisplayCardCaption>
              </DisplayCardHeader>
              <DisplayCardContent>
                {isReviewRequestsLoading && (
                  <Skeleton w="100%" height="16rem" />
                )}
                {isReviewRequestsError || validReviewRequests?.length === 0 ? (
                  <EmptyReviewRequest />
                ) : (
                  validReviewRequests?.map((reviewRequest) => (
                    <ReviewRequestCard reviewRequest={reviewRequest} />
                  ))
                )}
              </DisplayCardContent>
            </DisplayCard>
          </Box>

          <Spacer />

          {/* Right column */}
          <Box w="40%">
            <VStack spacing="1.25rem">
              {/* Site launch display card */}
              <SiteLaunchDisplayCard
                siteName={siteName}
                siteLaunchStatus={siteLaunchStatus}
                isSiteLaunchLoading={isSiteLaunchLoading}
                siteLaunchChecklistStepNumber={
                  siteLaunchStatusProps?.stepNumber
                }
              />
              {/* Human image and last saved/published */}
              <Box w="100%">
                {siteLaunchStatus === "LAUNCHED" && <SiteDashboardHumanImage />}
                <DisplayCard variant="content">
                  <DisplayCardContent overflow="hidden">
                    <VStack
                      spacing="0.5rem"
                      alignItems="left"
                      whiteSpace="nowrap"
                    >
                      <Skeleton isLoaded={!isSiteInfoLoading} w="100%">
                        <Text textStyle="caption-2" color="text.helper">
                          <b>Last saved</b>{" "}
                          {isSiteInfoError
                            ? "Unable to retrieve data"
                            : `${savedAt.date}, ${siteInfo?.savedBy}`}
                        </Text>
                      </Skeleton>

                      <Skeleton isLoaded={!isSiteInfoLoading} w="100%">
                        <Text textStyle="caption-2" color="text.helper">
                          <b>Last published</b>{" "}
                          {isSiteInfoError
                            ? "Unable to retrieve data"
                            : `${publishedAt.date}, ${siteInfo?.publishedBy}`}
                        </Text>
                      </Skeleton>

                      <Skeleton isLoaded={!isSiteLaunchLoading} w="100%">
                        {shouldUseSiteLaunchFeature(siteName) &&
                          siteLaunchStatus === "LAUNCHED" && (
                            <Flex alignItems="center">
                              <Text
                                textStyle="caption-2"
                                color="text.helper"
                                mr="0.5rem"
                              >
                                <b>Launched</b> 19 Jan 2022, Site status
                              </Text>
                              <Text
                                textStyle="caption-2"
                                color="interaction.success.default"
                              >
                                Live
                              </Text>
                            </Flex>
                          )}
                      </Skeleton>
                    </VStack>
                  </DisplayCardContent>
                </DisplayCard>
              </Box>
              {/* Site collaborators display card */}
              <Box id="isomer-dashboard-feature-tour-step-3" w="100%">
                <DisplayCard variant="full">
                  <DisplayCardHeader
                    button={
                      <Button
                        variant="link"
                        textStyle="subhead-1"
                        color="text.title.brand"
                        marginRight="0.75rem"
                        onClick={onCollaboratorsModalOpen}
                      >
                        Manage
                      </Button>
                    }
                  >
                    <DisplayCardTitle
                      icon={<Icon as={BiGroup} fontSize="1.5rem" />}
                    >
                      Site collaborators
                    </DisplayCardTitle>
                    <DisplayCardCaption>
                      Manage roles and access
                    </DisplayCardCaption>
                  </DisplayCardHeader>
                  <DisplayCardContent>
                    <Skeleton
                      isLoaded={!isCollaboratorsStatisticsLoading}
                      w="100%"
                    >
                      {!isCollaboratorsStatisticsError &&
                      collaboratorsStatistics ? (
                        <CollaboratorsStatistics
                          statistics={collaboratorsStatistics}
                        />
                      ) : (
                        <Text>Unable to retrieve data</Text>
                      )}
                    </Skeleton>
                  </DisplayCardContent>
                </DisplayCard>
              </Box>
              {/* Site settings display card */}
              <DisplayCard variant="header">
                <DisplayCardHeader
                  button={
                    <Button
                      variant="link"
                      textStyle="subhead-1"
                      color="text.title.brand"
                      marginRight="0.75rem"
                      as={RouterLink}
                      to={`/sites/${siteName}/settings`}
                    >
                      Manage
                    </Button>
                  }
                >
                  <DisplayCardTitle
                    icon={<Icon as={BiCog} fontSize="1.5rem" />}
                  >
                    Site settings
                  </DisplayCardTitle>
                  <DisplayCardCaption>
                    Manage site footer, links, logos, and more
                  </DisplayCardCaption>
                </DisplayCardHeader>
              </DisplayCard>
            </VStack>
          </Box>
        </Flex>

        <CollaboratorModal
          isOpen={isCollaboratorsModalOpen}
          onClose={onCollaboratorsModalClose}
        />
      </Container>
    </SiteViewLayout>
  )
}

const SiteLaunchDisplayCard = ({
  siteName,
  siteLaunchStatus,
  isSiteLaunchLoading,
  siteLaunchChecklistStepNumber,
}: SiteLaunchDisplayCardProps): JSX.Element => {
  if (!shouldUseSiteLaunchFeature(siteName)) return <></>
  if (siteLaunchStatus === "LAUNCHED") return <></>

  return (
    <Box w="100%">
      <DisplayCard variant="content">
        <Skeleton isLoaded={!isSiteLaunchLoading}>
          <DisplayCardHeader
            w="100%"
            button={
              <Link
                variant="link"
                textStyle="subhead-1"
                color="text.title.brand"
                marginRight="0.75rem"
                as={RouterLink}
                to={`/sites/${siteName}/siteLaunchPad`}
              >
                {siteLaunchStatus === "NOT_LAUNCHED" && (
                  <Text textStyle="subhead-1">Go to Launchpad</Text>
                )}
                {siteLaunchStatus === "CHECKLIST_TASKS_PENDING" && (
                  <Text textStyle="subhead-1">Visit launchpad</Text>
                )}
                {siteLaunchStatus === "LAUNCHING" && (
                  <Text textStyle="subhead-1">Check status</Text>
                )}
              </Link>
            }
          >
            <DisplayCardTitle
              icon={<Icon as={BxsClearRocket} fontSize="1.5rem" />}
            >
              Site launch
            </DisplayCardTitle>
            <DisplayCardCaption>
              Associate your isomer site to a domain
            </DisplayCardCaption>
          </DisplayCardHeader>
          <DisplayCardContent>
            <Skeleton isLoaded={!isSiteLaunchLoading} w="100%">
              {siteLaunchStatus === "CHECKLIST_TASKS_PENDING" && (
                <Text textStyle="body-2">
                  {siteLaunchChecklistStepNumber}/{SITE_LAUNCH_TASKS_LENGTH}
                </Text>
              )}
              {siteLaunchStatus === "LAUNCHING" && (
                <Text textStyle="body-2">Launch status: Pending</Text>
              )}
            </Skeleton>
          </DisplayCardContent>
        </Skeleton>
      </DisplayCard>
    </Box>
  )
}
