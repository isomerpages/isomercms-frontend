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
  Grid,
  GridItem,
  keyframes,
} from "@chakra-ui/react"
import { useFeatureIsOn } from "@growthbook/growthbook-react"
import { Button, Link } from "@opengovsg/design-system-react"
import _ from "lodash"
import { useState } from "react"
import { BiLoaderAlt, BiLeftArrowAlt, BiSolidInfoCircle } from "react-icons/bi"
// import { MdInfo } from "react-icons/md";
import { useParams, Link as RouterLink } from "react-router-dom"

import { Modal as CustomModal } from "components/Modal"
import PaginateButton from "components/paginateButton"

import { useGetBrokenLinks } from "hooks/siteDashboardHooks/useGetLinkChecker"
import { useRefreshLinkChecker } from "hooks/siteDashboardHooks/useRefreshLinkChecker"

import { NoBrokenLinksImage } from "assets"
import { colors } from "theme/foundations/colors"
import { NonPermalinkError } from "types/linkReport"

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
        <ModalHeader padding="0 1.5rem" bg={colors.base.canvas.default}>
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
      gap="1rem"
      mx="auto"
      px="2rem"
      bg="base.canvas.default"
    >
      <GridItem colSpan={1} />
      <GridItem colSpan={10}>
        <HStack
          w="100%"
          py="1.25rem"
          h="fit-content"
          justifyContent="space-between"
        >
          <Button
            variant="link"
            color="interaction.links.default"
            onClick={onClose}
          >
            <BiLeftArrowAlt />
            <Text ml="0.25rem" fontSize="0.875rem">
              Back to main report
            </Text>
          </Button>
          {!brokenLinksError && (
            <Button
              onClick={onClick}
              variant="solid"
              isDisabled={isBrokenLinksLoading}
              height="1.5rem"
              padding=".5rem 1rem"
              textStyle="subhead-2"
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
  const detailedErrorArr = _.sortBy(
    generateDetailedError(linksArr),
    (err) => err.detailedType
  )
  const { siteName } = useParams<{ siteName: string }>()
  const isBrokenLinksReporterEnabled = useFeatureIsOn(
    "is_broken_links_report_enabled"
  )
  const {
    data: brokenLinks,
    isLoading: isBrokenLinksFetching,
  } = useGetBrokenLinks(siteName, isBrokenLinksReporterEnabled)

  const isBrokenLinksLoading =
    brokenLinks?.status === "loading" || isBrokenLinksFetching

  return (
    <Grid
      templateColumns="repeat(12, 1fr)"
      w="100%"
      gap="1rem"
      mx="auto"
      px="2rem"
    >
      <GridItem colSpan={1} />
      <GridItem colSpan={10}>
        <VStack paddingTop="3rem" width="100%" align="center" spacing=".25rem">
          <Text
            textStyle="body-3"
            overflow="hidden"
            textColor="base.content.default"
            textOverflow="ellipsis"
            alignSelf="flex-start"
          >
            {pageCmsUrl.split("/").at(-1)}
          </Text>

          <HStack
            display="flex"
            align-items="center"
            gap="1.5rem"
            width="100%"
            paddingBottom="1.25rem"
          >
            <Text textStyle="h3" flex="1 0 0" alignSelf="flex-end">
              {isBrokenLinksLoading
                ? "Re-scanning page..."
                : `${detailedErrorArr.length} broken references found`}
            </Text>
            <Link alignSelf="flex-end" href={pageStagingUrl} isExternal>
              <Text>View page on staging</Text>
            </Link>
            <Link alignSelf="flex-end" href={pageCmsUrl} isExternal>
              <Text>Edit page on CMS</Text>
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
                paddingBottom="1.25rem"
              >
                <Text textStyle="body-2" textColor="base.content.medium">
                  {`After fixing the references , you can click the "Run check for this page" in the top right hand corner.`}
                </Text>
                <Box>
                  <PaginateButton
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
                      <Th textAlign="left" w="9rem" padding="0">
                        <HStack
                          height="3.5rem"
                          padding=".375rem 1rem"
                          gap=".5rem"
                        >
                          <Text textStyle="subhead-2" textTransform="none">
                            Type
                          </Text>
                        </HStack>
                      </Th>
                      <Th textAlign="left" padding=".375rem 1rem">
                        <Text textStyle="subhead-2" textTransform="none">
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
                              borderTop="1px"
                              borderColor="base.divider.medium"
                            >
                              <Td w="9rem" border="0" padding="0px 1rem">
                                <Text textStyle="subhead-2">
                                  {getErrorText(link)}
                                </Text>
                              </Td>
                              <Td align="left" border="0px" padding="0px">
                                <VStack
                                  display="flex"
                                  padding="1.125rem 1rem"
                                  flexDirection="column"
                                  alignItems="flex-start"
                                  gap="0"
                                  alignSelf="stretch"
                                >
                                  {isBrokenLink && (
                                    <Text
                                      textColor="base.content.medium"
                                      textStyle="body-2"
                                      paddingBottom=".25rem"
                                    >
                                      {link.linkedText
                                        ? `"${link.linkedText}"`
                                        : "Empty Link Text"}
                                    </Text>
                                  )}
                                  <Text
                                    textColor="base.content.strong"
                                    textStyle="body-2"
                                    paddingBottom="0.75rem"
                                  >
                                    {link.linkToAsset
                                      ? link.linkToAsset
                                      : "No URL linked"}
                                  </Text>
                                  <HStack>
                                    <BiSolidInfoCircle
                                      size="1rem"
                                      fill={colors.utility.feedback.critical}
                                    />

                                    <Text
                                      textColor="utility.feedback.critical"
                                      textStyle="caption-1"
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
  detailedType:
    | "broken-image"
    | "broken-file"
    | "email"
    | "missing-https"
    | "broken-link"
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

const getErrorText = (error: DetailedNonPermaLinkError) => {
  switch (error.detailedType) {
    case "broken-image":
      return "Image"
    case "broken-file":
      return "File"
    case "missing-https":
    case "broken-link":
      return "Hyperlink"
    case "email":
      return "Email"
    default: {
      const exception: never = error.detailedType
      throw new Error(exception)
    }
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
    case "email":
      return 'Add a "mailto:".'
    default: {
      const exception: never = error.detailedType
      throw new Error(exception)
    }
  }
}

const LinkReportModalNoBrokenLink = (props: Omit<ModalProps, "children">) => {
  const { onClose } = props
  const { siteName } = useParams<{ siteName: string }>()
  return (
    <Center w="22.5rem" pt="2rem">
      <VStack gap=".75rem">
        <NoBrokenLinksImage />
        <Text textStyle="h5" textAlign="center" pt="0.5rem">
          Hurrah! You’ve fixed all broken references on this page.
        </Text>
        <Text textStyle="body-2" textAlign="center">
          You can come back to scan this page again if you make edits to it.
        </Text>
        <Button mt="1rem" onClick={() => onClose()}>
          Back to main report
        </Button>
        <Button
          variant="link"
          color="interaction.links.default"
          as={RouterLink}
          to={`/sites/${siteName}/dashboard`}
          p="0.5rem"
        >
          Go to dashboard
        </Button>
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
          height="1.25rem"
          width="1.25rem"
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
