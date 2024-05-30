import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalProps,
  Text,
  Box,
  VStack,
  HStack,
  Center,
  TableContainer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Flex,
  Grid,
  GridItem,
  Icon,
  keyframes,
} from "@chakra-ui/react"
import { useFeatureIsOn } from "@growthbook/growthbook-react"
import {
  Button,
  ModalCloseButton,
  Link,
  Badge,
  Breadcrumb,
  Pagination,
  BxRightArrowAlt,
} from "@opengovsg/design-system-react"
import { set } from "lodash"
import React, { useEffect, useState } from "react"
import { BiLoaderAlt } from "react-icons/bi"
import { useQueryClient } from "react-query"
import { useParams } from "react-router-dom"

import { Modal as CustomModal } from "components/Modal"
import PaginateBtn from "components/paginateBtn"

import { SITE_LINK_CHECKER_STATUS_KEY } from "constants/queryKeys"

import { invalidateMergeRelatedQueries } from "hooks/reviewHooks"
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
} from "types/linkReport"

export const LinkReportModal = ({
  props,
  linksArr,
  pageCmsUrl,
  pageStagingUrl,
}: {
  props: Omit<ModalProps, "children">
  linksArr: NonPermalinkError[]
  pageCmsUrl: string
  pageStagingUrl: string
}): JSX.Element => {
  return (
    <CustomModal {...props} size="full">
      <ModalOverlay />
      <ModalContent bgColor="base.canvas.alt">
        <ModalHeader padding="0" bg={colors.base.canvas.default}>
          <LinkReportModalBanner {...props} />
        </ModalHeader>
        <ModalBody>
          <Center>
            <LinksReportDetails
              linksArr={linksArr}
              pageCmsUrl={pageCmsUrl}
              pageStagingUrl={pageStagingUrl}
              props={props}
            />
          </Center>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </CustomModal>
  )
}

const LinkReportModalBanner = (props: Omit<ModalProps, "children">) => {
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

  const { onClose } = props
  return (
    <Grid
      templateColumns="repeat(12, 1fr)"
      w="100%"
      maxW="1440px"
      gap="16px"
      mx="auto"
      px="32px"
      bg="white"
    >
      <GridItem colSpan={1} />
      <GridItem colSpan={10}>
        <HStack
          w="100%"
          padding="20px 0"
          h="fit-content"
          justifyContent="space-between"
        >
          <Button
            variant="link"
            color={colors.interaction.links.default}
            onClick={onClose}
          >
            <BxRightArrowAlt transform="scale(-1,1)" h="20px" w="20px" />
            <Text
              ml="4px"
              fontFamily={typography.fontFamilies.inter}
              fontSize="14px"
            >
              Back to main report
            </Text>
          </Button>
          {!brokenLinksError && (
            <Button
              onClick={onClick}
              variant="solid"
              isDisabled={isBrokenLinksLoading}
              height="24px"
              padding="8px 16px"
              fontSize="14px"
              size="xs"
            >
              {isBrokenLinksLoading
                ? "Running checker..."
                : "Run check for this page"}
            </Button>
          )}
        </HStack>
      </GridItem>
    </Grid>
  )
}

const LinksReportDetails = ({
  linksArr,
  pageCmsUrl,
  pageStagingUrl,
  props,
}: {
  linksArr: NonPermalinkError[]
  pageCmsUrl: string
  pageStagingUrl: string
  props: Omit<ModalProps, "children">
}) => {
  const [pageNum, setPageNum] = useState(1)

  // Sort based on error type
  const detailedErrorArr = generateDetailedError(linksArr).sort((a, b) => {
    return a.detailedType.localeCompare(b.detailedType)
  })
  const { siteName } = useParams<{ siteName: string }>()
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
        <VStack paddingTop="48px" width="100%" align="center" spacing="4px">
          <Text
            font-feature-settings="cv10 cv05"
            font-variant-numeric="lining-nums tabular-nums"
            textStyle="body-3"
            fontFamily={typography.fontFamilies.inter}
            overflow="hidden"
            color={colors.base.content.default}
            textOverflow="ellipsis"
            alignSelf="flex-start"
          >
            {pageCmsUrl.split("/").at(-1)}
          </Text>

          <HStack
            display="flex"
            align-items="center"
            gap="24px"
            width="100%"
            paddingBottom="20px"
          >
            <Text
              fontSize="28px"
              fontStyle="normal"
              fontWeight="600"
              lineHeight="36px"
              fontFamily="Inter"
              flex="1 0 0"
              font-feature-settings="cv10 cv05"
              alignSelf="flex-start"
            >
              {isBrokenLinksLoading
                ? "Re-scanning page..."
                : `${detailedErrorArr.length} broken references found`}
            </Text>
            <Link href={pageStagingUrl} isExternal>
              <HStack spacing="1">
                <Text>View page on staging</Text>
              </HStack>
            </Link>
            <Link href={pageCmsUrl} isExternal>
              <HStack spacing="1">
                <Text>Edit page on CMS</Text>
              </HStack>
            </Link>
          </HStack>
          {!isBrokenLinksLoading && detailedErrorArr.length === 0 && (
            <LinkReportModalNoBrokenLink {...props} />
          )}

          {(isBrokenLinksLoading || detailedErrorArr.length !== 0) && (
            <>
              <HStack
                justifyContent="space-between"
                display="flex"
                width="100%"
                paddingBottom="20px"
              >
                <Text
                  textStyle="body-2"
                  fontFamily={typography.fontFamilies.inter}
                  color="base.content.medium"
                >
                  After fixing the references, you can click the &quot;Run check
                  for this page&quot; in the top right hand corner.
                </Text>
                <Box>
                  <PaginateBtn
                    currentPage={pageNum}
                    totalPage={Math.max(
                      1,
                      Math.ceil(detailedErrorArr.length / 5)
                    )}
                    onPageChange={(newPage: number) => setPageNum(newPage)}
                  />
                </Box>
              </HStack>
              <TableContainer
                mb="1.5rem"
                width="100%"
                backgroundColor="utility.ui"
                borderRadius="8px"
                border="1px"
                borderColor="base.divider.medium"
              >
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th textAlign="left" width="144px" padding="0">
                        <HStack
                          height="56px"
                          padding="6px 16px"
                          gap="8px"
                          fontFamily={typography.fontFamilies.inter}
                        >
                          <Text textStyle="subhead-2" textTransform="none">
                            Type
                          </Text>
                        </HStack>
                      </Th>
                      <Th textAlign="left" padding="6px 16px">
                        <Text
                          textStyle="subhead-2"
                          fontFamily={typography.fontFamilies.inter}
                          textTransform="none"
                        >
                          Reference and Error
                        </Text>
                      </Th>
                    </Tr>
                  </Thead>
                  {!isBrokenLinksLoading && (
                    <Tbody>
                      {detailedErrorArr
                        .slice((pageNum - 1) * 5, pageNum * 5)
                        .map((link) => {
                          const isBrokenLink = link.type === "broken-link"
                          return (
                            <Tr
                              key={link.linkToAsset}
                              borderTop="1px"
                              borderColor="base.divider.medium"
                            >
                              <Td width="144px" border="0px" padding="0px 16px">
                                <Flex
                                  height="100%"
                                  align="center"
                                  justify="left"
                                >
                                  <Text
                                    textStyle="subhead-2"
                                    fontFamily={typography.fontFamilies.inter}
                                  >
                                    {getErrorText(link)}
                                  </Text>
                                </Flex>
                              </Td>
                              <Td align="left" border="0px" padding="0px">
                                <VStack
                                  display="flex"
                                  padding="18px 16px"
                                  flexDirection="column"
                                  alignItems="flex-start"
                                  gap="0"
                                  alignSelf="stretch"
                                >
                                  {isBrokenLink && (
                                    <Text
                                      color={colors.base.content.medium}
                                      textStyle="body-2"
                                      paddingBottom="4px"
                                      fontFamily={typography.fontFamilies.inter}
                                    >
                                      {link.linkedText
                                        ? `"${link.linkedText}"`
                                        : "Empty Link Text"}
                                    </Text>
                                  )}
                                  <Text
                                    color={colors.base.content.strong}
                                    textStyle="body-2"
                                    paddingBottom="12px"
                                    fontFamily={typography.fontFamilies.inter}
                                  >
                                    {link.linkToAsset
                                      ? link.linkToAsset
                                      : "No URL linked"}
                                  </Text>
                                  <HStack>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 16 16"
                                      fill="none"
                                    >
                                      <path
                                        d="M8.00004 1.3335C4.32404 1.3335 1.33337 4.32416 1.33337 8.00016C1.33337 11.6762 4.32404 14.6668 8.00004 14.6668C11.676 14.6668 14.6667 11.6762 14.6667 8.00016C14.6667 4.32416 11.676 1.3335 8.00004 1.3335ZM8.66671 11.3335H7.33337V7.3335H8.66671V11.3335ZM8.66671 6.00016H7.33337V4.66683H8.66671V6.00016Z"
                                        fill="#C03434"
                                      />
                                    </svg>
                                    <Text
                                      color={colors.utility.feedback.critical}
                                      textStyle="caption-1"
                                      fontFamily={typography.fontFamilies.inter}
                                    >
                                      {getSuggestion(link)}
                                    </Text>
                                  </HStack>
                                </VStack>
                              </Td>
                            </Tr>
                          )
                        })}
                    </Tbody>
                  )}

                  {isBrokenLinksLoading && (
                    <Tbody>
                      <Tr borderTop="1px" borderColor="base.divider.medium">
                        <Td colSpan={3} border="0px">
                          <LinkReportModalLoading />
                        </Td>
                      </Tr>
                    </Tbody>
                  )}
                </Table>
              </TableContainer>
            </>
          )}
        </VStack>
      </GridItem>
    </Grid>
  )
}

type DetailedNonPermaLinkError = NonPermalinkError & {
  detailedType: string
}

const isEmailError = (error: NonPermalinkError): boolean => {
  return (
    error.type === "broken-link" &&
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(error.linkToAsset)
  )
}

const isMissingHttpsError = (error: NonPermalinkError): boolean => {
  return !/^(https:\/\/|http:\/\/|\/)/.test(error.linkToAsset)
}

const generateDetailedError = (
  errors: NonPermalinkError[]
): DetailedNonPermaLinkError[] => {
  return errors.map((error) => {
    if (error.type === "broken-image")
      return { ...error, detailedType: "broken-image" }
    if (error.type === "broken-file")
      return { ...error, detailedType: "broken-file" }
    if (isEmailError(error)) return { ...error, detailedType: "email" }
    if (isMissingHttpsError(error))
      return { ...error, detailedType: "missing-https" }
    return { ...error, detailedType: "broken-link" }
  })
}

const getErrorText = (error: DetailedNonPermaLinkError): string => {
  switch (error.detailedType) {
    case "broken-image":
      return "Image"
    case "broken-file":
      return "File"
    case "missing-https":
    case "broken-link":
      return "Hyperlink"
    default:
      return "Email"
  }
}

const getSuggestion = (error: DetailedNonPermaLinkError): string => {
  switch (error.detailedType) {
    case "broken-image":
      return "Image doesn't exist."
    case "broken-file":
      return "File doesn't exist."
    case "broken-link":
      return "Page doesn't exist."
    case "missing-https":
      return 'Add a "https://".'
    default:
      return 'Add a "mailto:".'
  }
}

const LinkReportModalNoBrokenLink = (props: Omit<ModalProps, "children">) => {
  const { onClose } = props
  return (
    <Center>
      <VStack>
        <NoBrokenLinksImage />
        <Text mt="1rem" textStyle="h2">
          Hurrah! You’ve fixed all broken references on this page.
        </Text>
        <Text textStyle="body-1">
          You can come back to scan this page again if you make edits to it.
        </Text>
        <Button onClick={() => onClose()}>Back to main report</Button>
      </VStack>
    </Center>
  )
}

const LinkReportModalLoading = () => {
  const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  `

  return (
    <Center h="40vh">
      <VStack width="24rem">
        <Box
          as={BiLoaderAlt}
          animation={`${spin} 1s linear infinite`}
          height="20px"
          width="20px"
        />
        <Text textStyle="h5" textAlign="center">
          Taking another closer look at this page...
        </Text>
        <Text textStyle="body-2" textAlign="center">
          Broken references will appear here. This might take a while.
        </Text>
      </VStack>
    </Center>
  )
}
