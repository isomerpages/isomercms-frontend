import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  Skeleton,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { ButtonLink } from "components/ButtonLink"
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
import { BiCheckCircle, BiCog, BiEditAlt, BiGroup } from "react-icons/bi"
import { useParams, Link as RouterLink } from "react-router-dom"

import {
  useGetSiteInfo,
  useGetReviewRequests,
  useGetCollaboratorsStatistics,
} from "hooks/siteDashboardHooks"

import { SiteDashboardHumanImage } from "assets"

import { SiteViewLayout } from "../layouts"

import { CollaboratorsStatistics } from "./components/CollaboratorsStatistics"
import { EmptyReviewRequest } from "./components/EmptyReviewRequest"
import { ReviewRequestCard } from "./components/ReviewRequestCard"

export const SiteDashboard = (): JSX.Element => {
  const { siteName } = useParams<{ siteName: string }>()
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

  return (
    <SiteViewLayout overflow="hidden" px="10">
      <Container maxW="container.xl" minH="100vh">
        {/* Heading section */}
        <Flex px="4rem">
          <Heading as="h2" noOfLines={1} w="70%">
            {siteName}
          </Heading>
          <Spacer />
          <HStack spacing="1.25rem">
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
        <Flex px="4rem" pt="5" gap="2">
          {/* Left column */}
          <Box w="60%">
            <DisplayCard variant="headerAndContent">
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
                {isReviewRequestsError || reviewRequests?.length === 0 ? (
                  <EmptyReviewRequest />
                ) : (
                  reviewRequests?.map((reviewRequest) => (
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
              {/* Human image and last saved/published */}
              <Box w="100%">
                <SiteDashboardHumanImage />
                <DisplayCard variant="onlyContent">
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
                            : `${siteInfo?.savedAt}, ${siteInfo?.savedBy}`}
                        </Text>
                      </Skeleton>

                      <Skeleton isLoaded={!isSiteInfoLoading} w="100%">
                        <Text textStyle="caption-2" color="text.helper">
                          <b>Last published</b>{" "}
                          {isSiteInfoError
                            ? "Unable to retrieve data"
                            : `${siteInfo?.publishedAt}, ${siteInfo?.publishedBy}`}
                        </Text>
                      </Skeleton>
                    </VStack>
                  </DisplayCardContent>
                </DisplayCard>
              </Box>

              {/* Site collaborators display card */}
              <DisplayCard variant="headerAndContent">
                <DisplayCardHeader
                  button={
                    <Text
                      textStyle="subhead-1"
                      color="text.title.brand"
                      marginRight="1rem"
                      as={RouterLink}
                      to="/sites"
                    >
                      Manage
                    </Text>
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

              {/* Site settings display card */}
              <DisplayCard variant="onlyHeader">
                <DisplayCardHeader
                  button={
                    <Text
                      textStyle="subhead-1"
                      color="text.title.brand"
                      marginRight="1rem"
                      as={RouterLink}
                      to={`/sites/${siteName}/settings`}
                    >
                      Manage
                    </Text>
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
      </Container>
    </SiteViewLayout>
  )
}
