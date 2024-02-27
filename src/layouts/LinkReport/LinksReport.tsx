import {
  Box,
  BreadcrumbItem,
  Center,
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
} from "@chakra-ui/react"
import { useFeatureIsOn } from "@growthbook/growthbook-react"
import { Badge, Breadcrumb, Button, Link } from "@opengovsg/design-system-react"
import { set } from "lodash"
import { useEffect, useState } from "react"
import { useQueryClient } from "react-query"
import { Redirect, useParams } from "react-router-dom"

import { SITE_LINK_CHECKER_STATUS_KEY } from "constants/queryKeys"

import { useGetStagingUrl } from "hooks/siteDashboardHooks"
import { useGetBrokenLinks } from "hooks/siteDashboardHooks/useGetLinkChecker"
import { useRefreshLinkChecker } from "hooks/siteDashboardHooks/useRefreshLinkChecker"

import { NoBrokenLinksImage } from "assets"
import {
  isBrokenRefError,
  NonPermalinkError,
  NonPermalinkErrorDto,
  RepoError,
} from "types/linkReport"

import { SiteViewHeader } from "../layouts/SiteViewLayout/SiteViewHeader"

const getBreadcrumb = (viewablePageInCms: string): string => {
  /**
   * There are four main types of pages
   * 1. /folders/parentFolder/subfolders/childFolder/editPage/page.md -> parentFolder/childFolder/page
   * 2. /folders/parentFolder/editPage/page.md -> parentFolder/page
   * 3. /editPage/page.md -> page
   * 4. /resourceRoom/resourceRmName/resourceCategory/resourceCatName/editPage/page.md -> resourceRmName/resourceCatName/page
   */
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
      <HStack w="100%" justifyContent="space-between">
        <VStack ml="2rem" w="100%" alignItems="start" mt="4rem">
          <Badge variant="subtle" mt="0.75rem" mb="0.5rem">
            Experimental feature
          </Badge>
          <Text textStyle="h2" textColor="black" textAlign="left" mb="0.5rem">
            Broken references report
          </Text>

          <Text
            textStyle="subheading-1"
            color="black"
            textAlign="left"
            mb="3rem"
          >
            This report contains a list of broken references found in your site.
          </Text>
        </VStack>
        {!brokenLinksError && (
          <Button
            onClick={onClick}
            variant="solid"
            isDisabled={isBrokenLinksLoading}
            mr="2rem"
            mt="6.5rem"
          >
            {isBrokenLinksLoading ? "Running checker..." : "Run checker again"}
          </Button>
        )}
      </HStack>
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

const SiteReportCard = ({
  breadcrumb,
  links,
}: {
  breadcrumb: string
  links: NonPermalinkErrorDto[]
}) => {
  // can use any link since we know all the links are from the same page
  const { viewablePageInStaging, viewablePageInCms } = links[0]
  const { siteName } = useParams<{ siteName: string }>()
  const { data: stagingUrl, isLoading: isStagingUrlLoading } = useGetStagingUrl(
    siteName
  )

  const normalisedStagingUrl = normaliseUrl(stagingUrl || "")
  const normalisedViewablePageInStaging = normaliseUrl(viewablePageInStaging)
  const viewableLinkInStaging = `${normalisedStagingUrl}/${normalisedViewablePageInStaging}`

  return (
    <VStack
      w="calc(100vw - 24.25rem)"
      backgroundColor="base.canvas.default"
      mb="1.5rem"
      alignSelf="baseline"
      id={viewablePageInStaging}
    >
      <HStack
        alignSelf="center"
        justifyContent="space-between"
        w="95%"
        mt="1.5rem"
        mb="1.75rem"
      >
        <Breadcrumb separator="/">
          {breadcrumb.split("/").map((item) => {
            return (
              <BreadcrumbItem>
                <Text textStyle="h6">{item}</Text>
              </BreadcrumbItem>
            )
          })}
        </Breadcrumb>
        <HStack spacing="0.75rem" pt="0.25rem">
          <Link
            href={viewableLinkInStaging}
            isExternal
            isDisabled={isStagingUrlLoading}
          >
            View on staging
          </Link>
          <Link
            href={viewablePageInCms}
            isExternal
            isDisabled={isStagingUrlLoading}
          >
            Edit page
          </Link>
        </HStack>
      </HStack>
      <TableContainer w="95%" mb="1.5rem">
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Error type</Th>
              <Th>Broken URL</Th>
              <Th>Link Text</Th>
            </Tr>
          </Thead>
          <Tbody>
            {links.map((link) => {
              const errorType = link.type
                .split("-")
                .map(
                  (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
                )
                .join(" ")

              const isBrokenLink = link.type === "broken-link"

              if (isBrokenLink) {
                return (
                  <Tr>
                    <Td borderBottom={0}>{errorType}</Td>

                    {link.linkToAsset ? (
                      <Td borderBottom={0}>{link.linkToAsset}</Td>
                    ) : (
                      <Td borderBottom={0}>No URL linked</Td>
                    )}

                    {link.linkedText ? (
                      <Td borderBottom={0}>{link.linkedText}</Td>
                    ) : (
                      <Td borderBottom={0}>Empty link text</Td>
                    )}
                  </Tr>
                )
              }

              return (
                <Tr>
                  <Td borderBottom={0}>{errorType}</Td>
                  <Td borderBottom={0}>{link.linkToAsset}</Td>
                  <Td borderBottom={0}>Not applicable</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  )
}

const LinkContent = ({ brokenLinks }: { brokenLinks: RepoError[] }) => {
  const links: NonPermalinkError[] = (brokenLinks.filter((error) =>
    isBrokenRefError(error)
  ) as NonPermalinkErrorDto[]).map((error) => {
    return {
      ...error,
      breadcrumb: getBreadcrumb(error.viewablePageInCms),
    }
  })

  const pagesWithBrokenLinks: Map<string, string> = new Map()
  const brokenLink: number = links.filter(
    (error) => error.type === "broken-link"
  ).length
  const brokenImage: number = links.filter(
    (error) => error.type === "broken-image"
  ).length
  // create a set of <breadcrumb, [errors]> pairs
  const siteToErrorMap = new Map<string, NonPermalinkErrorDto[]>()
  links.forEach((error) => {
    const { breadcrumb } = error

    if (siteToErrorMap.has(breadcrumb)) {
      siteToErrorMap.get(breadcrumb)?.push(error)
    } else {
      siteToErrorMap.set(breadcrumb, [error])
      pagesWithBrokenLinks.set(breadcrumb, error.viewablePageInStaging)
    }
  })

  return (
    <HStack
      pl="1rem"
      spacing="1rem"
      alignContent="normal"
      alignItems="flex-start"
    >
      <VStack
        spacing="0.5rem"
        m="1rem"
        textStyle="body-1"
        alignItems="start"
        position="sticky"
        top="2rem"
      >
        <Text mb="0.25rem" textStyle="h5">
          Pages with broken links
        </Text>

        {Array.from(pagesWithBrokenLinks.keys()).map((page) => (
          // safe to assert as we know the key exists
          <Link href={`#${pagesWithBrokenLinks.get(page)!}`} textStyle="body-2">
            {page}
          </Link>
        ))}
      </VStack>
      <VStack width="calc(100vw - 350px)">
        <HStack spacing="2rem" w="calc(100vw - 350px)" m="1.5rem" mt="1rem">
          <VStack align="stretch">
            <Text textStyle="body-1">Broken links</Text>
            <Text textStyle="h4">{brokenLink}</Text>
          </VStack>
          <VStack align="stretch">
            <Text textStyle="body-1">Broken images</Text>
            <Text textStyle="h4">{brokenImage}</Text>
          </VStack>
        </HStack>
        {Array.from(siteToErrorMap.keys()).map((breadcrumb) => {
          return (
            <SiteReportCard
              breadcrumb={breadcrumb}
              // safe to assert as we know the key exists
              links={siteToErrorMap.get(breadcrumb)!} // safe to assert as we know the key exists
            />
          )
        })}
      </VStack>
    </HStack>
  )
}

const NoBrokenLinks = () => {
  return (
    <Center height="70vh">
      <VStack>
        <NoBrokenLinksImage />
        <Text mt="1rem" textStyle="h2">
          No broken links found
        </Text>
        <Text textStyle="body-1">
          Your site is in good shape. No broken references were found.
        </Text>
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
          {" "}
          You might want to try running the check again. If the issue persists,
          reach out to Isomer Support.
        </Text>
        <Button
          onClick={() => {
            refreshLinkChecker(siteName)
          }}
        >
          Run check again
        </Button>
      </VStack>
    </Center>
  )
}

const LoadingLinkChecker = () => {
  return (
    <Center h="70vh">
      <VStack width="24rem">
        <Text textStyle="h4" textAlign="center">
          Scanning your site for broken references{" "}
        </Text>
        <Text textStyle="body-1" textAlign="center">
          This may take a while...
        </Text>
      </VStack>
    </Center>
  )
}

const LinkBody = () => {
  const isBrokenLinksReporterEnabled = useFeatureIsOn(
    "is_broken_links_report_enabled"
  )
  const { siteName } = useParams<{ siteName: string }>()
  const { data: brokenLinks, isError: isBrokenLinksError } = useGetBrokenLinks(
    siteName,
    isBrokenLinksReporterEnabled
  )

  if (
    !isBrokenLinksReporterEnabled ||
    isBrokenLinksError ||
    brokenLinks?.status === "error"
  ) {
    return <ErrorLoading />
  }

  if (brokenLinks?.status === "success") {
    if (brokenLinks?.errors?.length === 0) {
      return <NoBrokenLinks />
    }

    return <LinkContent brokenLinks={brokenLinks.errors} />
  }

  return <LoadingLinkChecker />
}

export const LinksReport = () => {
  return (
    <>
      <SiteViewHeader />
      <Box backgroundColor="base.canvas.alt">
        <LinksReportBanner />
        <LinkBody />
      </Box>
    </>
  )
}
