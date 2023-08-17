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
import _ from "lodash"
import { useEffect } from "react"
import { BiCheckCircle, BiCog, BiEditAlt, BiGroup } from "react-icons/bi"
import { useParams, Link as RouterLink } from "react-router-dom"

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

import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import { useLoginContext } from "contexts/LoginContext"
import { useSiteLaunchContext } from "contexts/SiteLaunchContext"

import { useGetCollaboratorRoleHook } from "hooks/collaboratorHooks"
import {
  useGetSiteInfo,
  useGetReviewRequests,
  useGetCollaboratorsStatistics,
  useUpdateViewedReviewRequests,
} from "hooks/siteDashboardHooks"
import useRedirectHook from "hooks/useRedirectHook"

import { getDateTimeFromUnixTime } from "utils/date"
import { isSiteLaunchEnabled } from "utils/siteLaunchUtils"

import { BxsClearRocket, SiteDashboardHumanImage } from "assets"
import { FeatureTourHandler } from "features/FeatureTour/FeatureTour"
import { DASHBOARD_FEATURE_STEPS } from "features/FeatureTour/FeatureTourSequence"
import {
  NEW_DOMAIN_SITE_LAUNCH_TASKS_LENGTH,
  SiteLaunchFEStatus,
  SITE_LAUNCH_TASKS_LENGTH,
} from "types/siteLaunch"

import { SiteViewLayout } from "../layouts"

import { CollaboratorsStatistics } from "./components/CollaboratorsStatistics"
import { EmptyReviewRequest } from "./components/EmptyReviewRequest"
import { ReviewRequestCard } from "./components/ReviewRequestCard"

export const SiteDashboard = (): JSX.Element => {
  const {
    isOpen: isCollaboratorsModalOpen,
    onOpen: onCollaboratorsModalOpen,
    onClose: onCollaboratorsModalClose,
  } = useDisclosure()
  const { siteName } = useParams<{ siteName: string }>()
  const { data: role } = useGetCollaboratorRoleHook(siteName)
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
  const isSiteLaunchLoading = siteLaunchStatus === SiteLaunchFEStatus.Loading

  return (
    <SiteViewLayout overflow="hidden">
      <Container maxW="container.xl" minH="100vh">
        {/* Heading section */}
        <Flex px="4rem">
          <Heading as="h4" noOfLines={1} w="70%">
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
                  icon={<Icon as={BiCheckCircle} fontSize="1.25rem" />}
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
              <SiteLaunchDisplayCard />
              {/* Human image and last saved/published */}
              <Box w="100%">
                {(siteLaunchStatus === SiteLaunchFEStatus.Launched ||
                  !isSiteLaunchEnabled(siteName, role)) && (
                  <SiteDashboardHumanImage />
                )}
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
                        {isSiteLaunchEnabled(siteName, role) &&
                          siteLaunchStatus === SiteLaunchFEStatus.Launching && (
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
                      icon={<Icon as={BiGroup} fontSize="1.25rem" />}
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
                    icon={<Icon as={BiCog} fontSize="1.25rem" />}
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

const SiteLaunchDisplayCard = (): JSX.Element => {
  const { siteName } = useParams<{ siteName: string }>()
  const { data: role } = useGetCollaboratorRoleHook(siteName)
  const { siteLaunchStatusProps } = useSiteLaunchContext()
  const siteLaunchStatus = siteLaunchStatusProps?.siteLaunchStatus
  const siteLaunchChecklistStepNumber = siteLaunchStatusProps?.stepNumber
  const totalTasks = siteLaunchStatusProps?.isNewDomain
    ? NEW_DOMAIN_SITE_LAUNCH_TASKS_LENGTH
    : SITE_LAUNCH_TASKS_LENGTH
  const isSiteLaunchLoading = siteLaunchStatus === SiteLaunchFEStatus.Loading
  if (!isSiteLaunchEnabled(siteName, role)) return <></>
  if (siteLaunchStatus === SiteLaunchFEStatus.Launched) return <></>

  return (
    <Box w="100%">
      <DisplayCard>
        <Skeleton width="100%" isLoaded={!isSiteLaunchLoading}>
          <DisplayCardHeader
            button={
              <Link
                variant="link"
                textStyle="subhead-1"
                color="text.title.brand"
                as={RouterLink}
                to={`/sites/${siteName}/siteLaunchPad`}
              >
                {siteLaunchStatus === SiteLaunchFEStatus.NotLaunched && (
                  <Text textStyle="subhead-1" whiteSpace="nowrap">
                    Go to Launchpad
                  </Text>
                )}
                {siteLaunchStatus ===
                  SiteLaunchFEStatus.ChecklistTasksPending && (
                  <Text textStyle="subhead-1" whiteSpace="nowrap">
                    Manage
                  </Text>
                )}
                {(siteLaunchStatus === SiteLaunchFEStatus.Launching ||
                  siteLaunchStatus === SiteLaunchFEStatus.Failed) && (
                  <Text textStyle="subhead-1" whiteSpace="nowrap">
                    Check status
                  </Text>
                )}
              </Link>
            }
          >
            <DisplayCardTitle
              icon={<Icon as={BxsClearRocket} fontSize="1.25rem" />}
            >
              Site launch
            </DisplayCardTitle>
            <DisplayCardCaption>
              Associate your Isomer site to a domain
            </DisplayCardCaption>
          </DisplayCardHeader>
          <DisplayCardContent>
            {siteLaunchStatus === SiteLaunchFEStatus.ChecklistTasksPending && (
              <Text textStyle="body-2" mt="1rem">
                <Text as="b">
                  {siteLaunchChecklistStepNumber}/{totalTasks}
                </Text>{" "}
                site launch tasks completed
              </Text>
            )}
            {siteLaunchStatus === SiteLaunchFEStatus.Launching && (
              <Text textStyle="body-2" mt="1rem">
                Launch status: Pending
              </Text>
            )}
          </DisplayCardContent>
        </Skeleton>
      </DisplayCard>
    </Box>
  )
}
