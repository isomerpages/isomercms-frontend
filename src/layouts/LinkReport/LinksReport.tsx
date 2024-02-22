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
import { Redirect, useParams } from "react-router-dom"

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
import { useErrorToast } from "utils"

import { SiteViewHeader } from "../layouts/SiteViewLayout/SiteViewHeader"

const getBreadcrumb = (viewablePageInCms: string): string => {
  //! TODO: Fix bug for homepage + contact us
  /**
   * There are four main types of pages
   * 1. /folders/parentFolder/subfolders/childFolder/editPage/page.md -> parentFolder/childFolder/page
   * 2. /folders/parentFolder/editPage/page.md -> parentFolder/page
   * 3. /editPage/page.md -> Feedback Form
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

  const { data: brokenLinks } = useGetBrokenLinks(
    siteName,
    isBrokenLinksReporterEnabled
  )

  const isBrokenLinksLoading = brokenLinks?.status === "loading"
  return (
    <Center bg="white" minH="124">
      <VStack ml="3rem" w="70%" alignItems="start">
        <Text textStyle="h2" textColor="black" textAlign="left">
          Broken references report
          <Badge colorScheme="warning" variant="subtle" ml="1rem" mt="0.25rem">
            Experimental feature
          </Badge>
        </Text>
        <HStack w="100%" justifyContent="space-between">
          <Text textStyle="subheading-1" color="black" textAlign="left">
            This report contains a list of broken references found in your site.
          </Text>
          <Button
            onClick={onClick}
            variant="solid"
            isDisabled={isBrokenLinksLoading}
          >
            {isBrokenLinksLoading ? "Running checker..." : "Run Checker Again"}
          </Button>
        </HStack>
      </VStack>
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
      w="70vw"
      backgroundColor="base.canvas.brandLight"
      mb="1.5rem"
      id={viewablePageInStaging}
    >
      <HStack
        alignSelf="center"
        justifyContent="space-between"
        w="95%"
        mt="1rem"
        ml="-4rem"
      >
        <Breadcrumb separator="/" pl="1rem">
          {breadcrumb.split("/").map((item) => {
            return (
              <BreadcrumbItem>
                <Text textStyle="h6">{item}</Text>
              </BreadcrumbItem>
            )
          })}
        </Breadcrumb>
        <HStack pr="1rem" spacing="0.75rem" pt="0.25rem">
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
      <TableContainer w="95%" mb="1rem" ml="-4rem">
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
                    <Td>{errorType}</Td>

                    {link.linkToAsset ? (
                      <Td>{link.linkToAsset}</Td>
                    ) : (
                      <Td>No URL linked</Td>
                    )}

                    {link.linkedText ? (
                      <Td>{link.linkedText}</Td>
                    ) : (
                      <Td>Empty link text</Td>
                    )}
                  </Tr>
                )
              }

              return (
                <Tr>
                  <Td>{errorType}</Td>
                  <Td>{link.linkToAsset}</Td>
                  <Td>Not applicable</Td>
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
      <VStack spacing="0.5rem" m="1rem" textStyle="body-1" alignItems="start">
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
      <VStack w="70vw" mr="2rem">
        <HStack spacing="2rem" w="70vw" m="1.5rem" mt="1rem">
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
  const errorToast = useErrorToast()
  errorToast({
    id: "broken_links_error",
    description: `Failed to load broken links for ${siteName}. Please try again later.`,
  })
  return <Redirect to={`/sites/${siteName}/dashboard`} />
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

  return (
    <Center h="70vh">
      <VStack>
        <Text textStyle="h4" maxW="48" textAlign="center">
          Scanning your site for broken references{" "}
        </Text>
        <Text textStyle="body-1">This may take a while...</Text>
      </VStack>
    </Center>
  )
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
