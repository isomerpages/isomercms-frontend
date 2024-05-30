import {
  Box,
  BreadcrumbItem,
  Center,
  Grid,
  GridItem,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useDisclosure,
  keyframes,
} from "@chakra-ui/react"
import { useFeatureIsOn } from "@growthbook/growthbook-react"
import {
  Badge,
  Breadcrumb,
  Button,
  BxRightArrowAlt,
} from "@opengovsg/design-system-react"
import React, { useEffect, useState } from "react"
import { BiLoaderAlt } from "react-icons/bi"
import { Redirect, useParams, Link as RouterLink } from "react-router-dom"

import PaginateBtn from "components/paginateBtn"

import { SITE_LINK_CHECKER_STATUS_KEY } from "constants/queryKeys"

import { useGetStagingUrl } from "hooks/siteDashboardHooks"
import { useGetBrokenLinks } from "hooks/siteDashboardHooks/useGetLinkChecker"
import { useRefreshLinkChecker } from "hooks/siteDashboardHooks/useRefreshLinkChecker"

import { NoBrokenLinksImage } from "assets"
import { colors } from "theme/foundations/colors"
import { typography } from "theme/foundations/typography"
import {
  isBrokenRefError,
  NonPermalinkError,
  NonPermalinkErrorDto,
  RepoError,
  RepoErrorDto,
} from "types/linkReport"

import { SiteViewHeader } from "../layouts/SiteViewLayout/SiteViewHeader"

import { LinkReportModal } from "./components/LinkReportModal/LinkReportModal"

const getBreadcrumb = (viewablePageInCms: string): string => {
  const paths = viewablePageInCms.split("/")
  let breadcrumb = paths
    .filter((_, index) => index % 2 === 0)
    .slice(2)
    .join(" / ")
    .replace(/-/g, " ")
  if (breadcrumb.endsWith(".md")) {
    breadcrumb = breadcrumb.slice(0, -3)
  }
  return breadcrumb
}

export const LinksReportBanner = () => {
  const { siteName } = useParams<{ siteName: string }>()
  const { mutate: refreshLinkChecker } = useRefreshLinkChecker(siteName)
  const onClick = () => {
    refreshLinkChecker(siteName)
  }

  const isBrokenLinksReporterEnabled = useFeatureIsOn(
    "is_broken_links_report_enabled"
  )
  const {
    data: brokenLinks,
    error: brokenLinksError,
    isLoading: isBrokenLinksFetching,
  } = useGetBrokenLinks(siteName, isBrokenLinksReporterEnabled)
  const isBrokenLinksLoading =
    brokenLinks?.status === "loading" || isBrokenLinksFetching

  return (
    <Center bg="white">
      <Grid
        templateColumns="repeat(12, 1fr)"
        w="100%"
        maxW="1440px"
        gap="16px"
        mx="auto"
        px="32px"
      >
        <GridItem colSpan={1} />
        <GridItem colSpan={10}>
          <HStack w="100%" justifyContent="space-between">
            <VStack w="100%" alignItems="start" my="20px" spacing="8px">
              <Badge variant="subtle">Experimental feature</Badge>
              <Text
                textStyle="h6"
                textColor="base.content.strong"
                textAlign="left"
              >
                Broken references report for {siteName}
              </Text>
            </VStack>
            {!brokenLinksError && (
              <Button
                onClick={onClick}
                variant="solid"
                isDisabled={isBrokenLinksLoading}
                size="xs"
              >
                {isBrokenLinksLoading
                  ? "Running checker..."
                  : "Run check for site again"}
              </Button>
            )}
          </HStack>
        </GridItem>
      </Grid>
    </Center>
  )
}

const normaliseUrl = (url: string): string => {
  let normalisedUrl = url
  if (url.endsWith("/")) {
    normalisedUrl = url.slice(0, -1)
  }
  if (url.startsWith("/")) {
    normalisedUrl = url.slice(1)
  }
  return normalisedUrl
}

const NoBrokenLinks = () => {
  const { siteName } = useParams<{ siteName: string }>()
  return (
    <Center height="70vh">
      <VStack>
        <NoBrokenLinksImage />
        <Text mt="1rem" textStyle="h2">
          Hurrah! All your references are nice and sturdy.
        </Text>
        <Text textStyle="body-1">
          We couldn&apos;t find any broken references on your site. You can come
          back anytime to run the checker again.
        </Text>
        <Button as={RouterLink} to={`/sites/${siteName}/dashboard`}>
          Back to dashboard
        </Button>
      </VStack>
    </Center>
  )
}

const ErrorLoading = () => {
  const { siteName } = useParams<{ siteName: string }>()
  const { mutate: refreshLinkChecker } = useRefreshLinkChecker(siteName)
  return (
    <Center h="70vh">
      <VStack width="24rem">
        <Text textStyle="h4" textAlign="center" mb="0.5rem">
          {`We couldn't generate a broken report for this site.`}
        </Text>
        <Text textStyle="body-1" textAlign="center" mb="1rem">
          You might want to try running the check again. If the issue persists,
          reach out to Isomer Support.
        </Text>
        <Button onClick={() => refreshLinkChecker(siteName)}>
          Run check again
        </Button>
      </VStack>
    </Center>
  )
}

const LoadingLinkChecker = () => {
  const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `

  return (
    <Center h="40vh">
      <VStack width="24rem" color="base.content.default">
        <Box
          as={BiLoaderAlt}
          animation={`${spin} 1s linear infinite`}
          height="20px"
          width="20px"
        />
        <Text textStyle="h5" textAlign="center">
          Sniffing out broken links on your site...
        </Text>
        <Text textStyle="body-2" textAlign="center">
          Pages with broken references will appear here. This might take a
          while.
        </Text>
      </VStack>
    </Center>
  )
}

const LinkBody = () => {
  const {
    isOpen: isLinkReportModalOpen,
    onOpen: onLinkReportModalOpen,
    onClose: onLinkReportModalClose,
  } = useDisclosure()
  const [selectedLinkCms, setSelectedLinkCms] = useState("" as string)
  const [selectedLinkStaging, setSelectedLinkStaging] = useState("" as string)
  const isBrokenLinksReporterEnabled = useFeatureIsOn(
    "is_broken_links_report_enabled"
  )
  const { siteName } = useParams<{ siteName: string }>()
  const {
    data: brokenLinks,
    isError: isBrokenLinksError,
    isLoading: isBrokenLinksFetching,
  } = useGetBrokenLinks(siteName, isBrokenLinksReporterEnabled)

  if (
    !isBrokenLinksReporterEnabled ||
    isBrokenLinksError ||
    brokenLinks?.status === "error"
  ) {
    return <ErrorLoading />
  }

  if (brokenLinks?.status === "success") {
    if (brokenLinks?.errors?.length === 0) {
      return (
        <>
          <LinkReportModal
            props={{
              isOpen: isLinkReportModalOpen,
              onClose: onLinkReportModalClose,
            }}
            linksArr={[]}
            pageCmsUrl={selectedLinkCms}
            pageStagingUrl={selectedLinkStaging}
          />
          <NoBrokenLinks />
        </>
      )
    }

    const onlyDuplicatePermalinks = brokenLinks.errors.every(
      (error) => error.type === "duplicate-permalink"
    )
    if (onlyDuplicatePermalinks) {
      return (
        <>
          <LinkReportModal
            props={{
              isOpen: isLinkReportModalOpen,
              onClose: onLinkReportModalClose,
            }}
            linksArr={[]}
            pageCmsUrl={selectedLinkCms}
            pageStagingUrl={selectedLinkStaging}
          />
          <NoBrokenLinks />
        </>
      )
    }

    const links: NonPermalinkError[] = brokenLinks.errors
      .filter(isBrokenRefError)
      .map((error) => ({
        ...error,
        breadcrumb: getBreadcrumb(error.viewablePageInCms),
      }))

    const uniqueLinks = [
      ...new Set(links.map((error) => error.viewablePageInCms)),
    ]

    const sortedUniqueLinks = uniqueLinks.sort((a, b) => {
      const countA = links.filter((link) => link.viewablePageInCms === a).length
      const countB = links.filter((link) => link.viewablePageInCms === b).length
      return countB - countA
    })

    return (
      <>
        <LinkReportModal
          props={{
            isOpen: isLinkReportModalOpen,
            onClose: onLinkReportModalClose,
          }}
          linksArr={links.filter(
            (link) => link.viewablePageInCms === selectedLinkCms
          )}
          pageCmsUrl={selectedLinkCms}
          pageStagingUrl={selectedLinkStaging}
        />
        <Grid
          templateColumns="repeat(12, 1fr)"
          w="100%"
          maxW="1440px"
          gap="16px"
          mx="auto"
          px="32px"
          h="100%"
        >
          <GridItem colSpan={1} />
          <GridItem colSpan={10}>
            <VStack spacing="8px" pt="48px">
              <Text
                textStyle="h4"
                alignSelf="flex-start"
                textAlign="left"
                color="base.content.strong"
              >
                {sortedUniqueLinks.length} Pages with {links.length} broken
                references
              </Text>
              <HStack alignSelf="flex-start" paddingBottom="16px">
                <Text
                  textStyle="body-2"
                  textAlign="left"
                  color="base.content.medium"
                >
                  Click &apos;Review page&apos; to view a detailed list of
                  references broken on that page.
                </Text>
              </HStack>
              <TableContainer
                w="100%"
                maxW="container.xl"
                mb="1.5rem"
                borderRadius="8px"
                bgColor="utility.ui"
                border="1px"
                borderColor="base.divider.medium"
              >
                <Table>
                  <Thead>
                    <Tr>
                      <Th h="56px" textAlign="left" padding="6px 16px">
                        <Text
                          textStyle="subhead-2"
                          fontFamily={typography.fontFamilies.inter}
                          textTransform="none"
                        >
                          Page
                        </Text>
                      </Th>
                      <Th
                        w="200px"
                        h="56px"
                        textAlign="center"
                        padding="6px 16px"
                      >
                        <Text
                          textStyle="subhead-2"
                          fontFamily={typography.fontFamilies.inter}
                          textTransform="none"
                        >
                          Broken References
                        </Text>
                      </Th>
                      <Th w="200px" textAlign="left" padding="6px 16px">
                        <Text
                          textStyle="subhead-2"
                          fontFamily={typography.fontFamilies.inter}
                          textTransform="none"
                        >
                          View Details
                        </Text>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sortedUniqueLinks.map((itemUrl) => {
                      const uniqueBreadcrumb = getBreadcrumb(itemUrl)
                      return (
                        <Tr
                          key={itemUrl}
                          borderTop="1px"
                          borderColor="base.divider.medium"
                        >
                          <Td border="0px" padding="18px 16px">
                            <VStack alignItems="flex-start" spacing="4px">
                              <Text
                                textStyle="subhead-2"
                                fontFamily={typography.fontFamilies.inter}
                              >
                                {uniqueBreadcrumb.split("/").at(-1)}
                              </Text>
                              <Breadcrumb
                                separator="/"
                                color="base.content.medium"
                                size="xs"
                              >
                                {uniqueBreadcrumb.split("/").map((item) => (
                                  <BreadcrumbItem key={item}>
                                    <Text textStyle="caption-2">{item}</Text>
                                  </BreadcrumbItem>
                                ))}
                              </Breadcrumb>
                            </VStack>
                          </Td>
                          <Td w="200px" border="0px" padding="18px 16px">
                            <Text
                              textColor="base.content.strong"
                              textStyle="subhead-2"
                              fontFamily={typography.fontFamilies.inter}
                              alignSelf="stretch"
                              textAlign="center"
                            >
                              {
                                links.filter(
                                  (link) => link.viewablePageInCms === itemUrl
                                ).length
                              }
                            </Text>
                          </Td>
                          <Td w="200px" border="0px" padding="18px 16px">
                            <Button
                              variant="link"
                              textStyle="subhead-2"
                              fontFamily={typography.fontFamilies.inter}
                              color="interaction.links.default"
                              onClick={() => {
                                setSelectedLinkCms(itemUrl)
                                setSelectedLinkStaging(
                                  links.find(
                                    (item) => item.viewablePageInCms === itemUrl
                                  )!.viewablePageInStaging
                                ) // This shouldn't be null since there should be at least one error with the same cms url.
                                onLinkReportModalOpen()
                              }}
                            >
                              Review Page
                              <BxRightArrowAlt h="20px" w="20px" pl="4px" />
                            </Button>
                          </Td>
                        </Tr>
                      )
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          </GridItem>
        </Grid>
      </>
    )
  }

  return (
    <>
      <LinkReportModal
        props={{
          isOpen: isLinkReportModalOpen,
          onClose: onLinkReportModalClose,
        }}
        linksArr={[]}
        pageCmsUrl={selectedLinkCms}
        pageStagingUrl={selectedLinkStaging}
      />
      <Grid
        templateColumns="repeat(12, 1fr)"
        w="100%"
        maxW="1440px"
        gap="16px"
        mx="auto"
        px="32px"
        h="100%"
      >
        <GridItem colSpan={1} />
        <GridItem colSpan={10}>
          <VStack spacing="8px" pt="48px">
            <Text
              textStyle="h4"
              alignSelf="flex-start"
              textAlign="left"
              color="base.content.strong"
            >
              Pages with broken references
            </Text>
            <HStack alignSelf="flex-start" paddingBottom="16px">
              <Text
                textStyle="body-2"
                textAlign="left"
                color="base.content.medium"
              >
                Click &apos;Review page&apos; to view a detailed list of
                references broken on that page.
              </Text>
            </HStack>
            <TableContainer
              w="100%"
              maxW="container.xl"
              mb="1.5rem"
              borderRadius={8}
              bgColor="utility.ui"
              border="1px"
              borderColor="base.divider.medium"
            >
              <Table>
                <Thead>
                  <Tr>
                    <Th h="56px" textAlign="left" padding="6px 16px">
                      <Text
                        textStyle="subhead-2"
                        fontFamily={typography.fontFamilies.inter}
                        textTransform="none"
                      >
                        Page
                      </Text>
                    </Th>
                    <Th
                      w="200px"
                      h="56px"
                      textAlign="center"
                      padding="6px 16px"
                    >
                      <Text
                        textStyle="subhead-2"
                        fontFamily={typography.fontFamilies.inter}
                        textTransform="none"
                      >
                        Broken References
                      </Text>
                    </Th>
                    <Th w="200px" textAlign="left" padding="6px 16px">
                      <Text
                        textStyle="subhead-2"
                        fontFamily={typography.fontFamilies.inter}
                        textTransform="none"
                      >
                        View Details
                      </Text>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr borderTop="1px" borderColor="base.divider.medium">
                    <Td colSpan={3} border="0px">
                      <LoadingLinkChecker />
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </VStack>
        </GridItem>
      </Grid>
    </>
  )
}

export const LinksReport = () => {
  return (
    <Box backgroundColor="base.canvas.alt" minH="100vh">
      <SiteViewHeader />
      <Box>
        <LinksReportBanner />
        <LinkBody />
      </Box>
    </Box>
  )
}
