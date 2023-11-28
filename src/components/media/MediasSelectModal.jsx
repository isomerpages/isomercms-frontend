import {
  Box,
  VStack,
  Flex,
  Skeleton,
  Center,
  SimpleGrid,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
  BreadcrumbItem,
  BreadcrumbLink,
  Tab,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Grid,
  GridItem,
  FormControl,
  Image,
  Icon,
} from "@chakra-ui/react"
import {
  Button,
  Searchbar,
  Pagination,
  Breadcrumb,
  FormLabel,
  Input,
  SidebarContainer,
  SidebarItem,
} from "@opengovsg/design-system-react"
import { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { BiLeftArrowAlt, BiFolder } from "react-icons/bi"
import { useRouteMatch } from "react-router-dom"

import { ImagePreviewCard } from "components/ImagePreviewCard"
import { LoadingButton } from "components/LoadingButton"

import { MEDIA_PAGINATION_SIZE } from "constants/media"

import { useGetAllMediaFiles } from "hooks/directoryHooks/useGetAllMediaFiles"
import { useListMediaFolderFiles } from "hooks/directoryHooks/useListMediaFolderFiles"
import { useListMediaFolderSubdirectories } from "hooks/directoryHooks/useListMediaFolderSubdirectories"
import { usePaginate } from "hooks/usePaginate"

import { FilePreviewCard } from "layouts/Media/components"

import mediaStyles from "styles/isomer-cms/pages/Media.module.scss"

import { getMediaDirectoryName, getMediaLabels } from "utils/media"

import { deslugifyDirectory } from "utils"

const filterMediaByFileName = (medias, filterTerm) =>
  medias.filter((media) =>
    media.name.toLowerCase().includes(filterTerm.toLowerCase())
  )

const titleCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const MediasSelectModal = ({
  onProceed,
  onExternalProceed,
  onClose,
  onMediaSelect,
  onUpload,
  queryParams,
  setQueryParams,
  mediaType,
}) => {
  const { params } = useRouteMatch()
  const { fileName } = params

  const {
    singularMediaLabel,
    pluralMediaLabel,
    articleLabel,
    singularDirectoryLabel,
  } = getMediaLabels(mediaType)

  const { mediaRoom, mediaDirectoryName } = queryParams

  const [curPage, setCurPage] = usePaginate()

  const [mediaFolderSubdirectories, setMediaFolderSubdirectories] = useState([])
  const [mediaFolderFiles, setMediaFolderFiles] = useState([])
  const [total, setTotal] = useState()

  const [searchValue, setSearchedValue] = useState("")
  const {
    data: listMediaDirectoriesData,
    isLoading: isListMediaFolderSubdirectoriesLoading,
  } = useListMediaFolderSubdirectories({
    ...queryParams,
  })

  const {
    data: listMediaFilesData,
    isLoading: isListMediaFilesLoading,
  } = useListMediaFolderFiles(
    {
      ...queryParams,
      // NOTE: Subtracting 1 here because `usePaginate`
      // returns an index with 1 offset
      curPage: curPage - 1,
      limit: MEDIA_PAGINATION_SIZE,
      search: searchValue,
    },
    { initialData: { files: [] } }
  )

  useEffect(() => {
    if (listMediaDirectoriesData)
      setMediaFolderSubdirectories(listMediaDirectoriesData.directories)
  }, [listMediaDirectoriesData])

  useEffect(() => {
    if (listMediaFilesData) {
      setMediaFolderFiles(listMediaFilesData.files)
      setTotal(listMediaFilesData.total)
    }
  }, [listMediaFilesData])

  const files = useGetAllMediaFiles(
    mediaFolderFiles || [],
    params.siteName,
    mediaDirectoryName
  )

  const filteredDirectories = filterMediaByFileName(
    mediaFolderSubdirectories,
    searchValue
  )

  const filteredMedias = filterMediaByFileName(
    mediaFolderFiles,
    searchValue
  ).map(({ name }) => name)

  const { watch, handleSubmit, register } = useFormContext()
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (index) => {
    onMediaSelect("")
    setActiveTab(index)
  }

  const InternalMediaSelect = () => {
    return (
      <Grid h="100%" templateColumns="15.25rem 1fr">
        <GridItem borderRight="1px solid" borderColor="base.divider.medium">
          <VStack pr="1.25rem">
            {queryParams.mediaDirectoryName &&
              queryParams.mediaDirectoryName !== mediaType && (
                <Button
                  variant="clear"
                  alignSelf="start"
                  leftIcon={<Icon as={BiLeftArrowAlt} fontSize="1.25rem" />}
                  color="base.content.default"
                  onClick={() => {
                    onMediaSelect("")
                    setQueryParams((prevState) => {
                      return {
                        ...prevState,
                        mediaDirectoryName: getMediaDirectoryName(
                          queryParams.mediaDirectoryName,
                          {
                            end:
                              queryParams.mediaDirectoryName.split("%2F")
                                .length - 1,
                          }
                        ),
                      }
                    })
                  }}
                >
                  <Text textStyle="subhead-2">
                    {deslugifyDirectory(
                      getMediaDirectoryName(queryParams.mediaDirectoryName, {
                        start: -2,
                        end: -1,
                      })
                    )}
                  </Text>
                </Button>
              )}
            <Skeleton
              w="100%"
              h={
                isListMediaFolderSubdirectoriesLoading
                  ? "4.5rem"
                  : "fit-content"
              }
              isLoaded={!isListMediaFolderSubdirectoriesLoading}
              pb="2.25rem"
            >
              <SidebarContainer>
                {/* Directories */}
                {filteredDirectories.map((dir) => (
                  <SidebarItem
                    icon={BiFolder}
                    onClick={() => {
                      onMediaSelect("")
                      setQueryParams((prevState) => {
                        return {
                          ...prevState,
                          mediaDirectoryName: `${prevState.mediaDirectoryName}%2F${dir.name}`,
                        }
                      })
                    }}
                  >
                    {dir.name}
                  </SidebarItem>
                ))}
              </SidebarContainer>
            </Skeleton>
          </VStack>
        </GridItem>
        <GridItem>
          <Box pl="1.25rem">
            <div
              className={`${mediaStyles.mediaCards} justify-content-center pt-3 pl-2`}
            >
              <Skeleton
                w="100%"
                h={isListMediaFilesLoading ? "4.5rem" : "fit-content"}
                isLoaded={!isListMediaFilesLoading}
              >
                {files &&
                  !isListMediaFilesLoading &&
                  (searchValue
                    ? filteredMedias.length === 0 && (
                        <VStack
                          h="100%"
                          w="100%"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text>
                            We couldn’t find any {pluralMediaLabel} with “
                            {searchValue}”.
                          </Text>
                          {queryParams.mediaDirectoryName !==
                            pluralMediaLabel && (
                            <Button
                              variant="clear"
                              onClick={() => {
                                setQueryParams((prevState) => ({
                                  ...prevState,
                                  mediaDirectoryName: pluralMediaLabel,
                                }))
                              }}
                            >
                              Search in All {pluralMediaLabel} instead
                            </Button>
                          )}
                        </VStack>
                      )
                    : listMediaFilesData.total === 0 && (
                        <Text>
                          No {pluralMediaLabel} in this {singularDirectoryLabel}
                          .
                        </Text>
                      ))}

                <SimpleGrid w="100%" columns={3} spacing="2.5%">
                  {files &&
                    files
                      .filter(({ data }) => filteredMedias.includes(data?.name))
                      .map(({ data, isLoading }) => (
                        <Skeleton
                          w="100%"
                          h={isLoading ? "4.5rem" : "fit-content"}
                          isLoaded={!isLoading}
                          key={data.name}
                        >
                          {mediaType === "images" ? (
                            <ImagePreviewCard
                              name={data.name}
                              addedTime={data.addedTime}
                              mediaUrl={data.mediaUrl}
                              isSelected={
                                data.name === watch("selectedMedia")?.name
                              }
                              onClick={() => onMediaSelect(data)}
                              isMenuNeeded={false}
                            />
                          ) : (
                            <FilePreviewCard
                              name={data.name}
                              addedTime={data.addedTime}
                              mediaUrl={data.mediaUrl}
                              isSelected={
                                data.name === watch("selectedMedia")?.name
                              }
                              onClick={() => onMediaSelect(data)}
                              isMenuNeeded={false}
                            />
                          )}
                        </Skeleton>
                      ))}
                </SimpleGrid>
              </Skeleton>
              {files && mediaFolderFiles && total > 0 && (
                <Center
                  w="100%"
                  pt={mediaType === "images" ? "12.5rem" : "6.25rem"}
                >
                  <Pagination
                    totalCount={total}
                    pageSize={MEDIA_PAGINATION_SIZE}
                    currentPage={curPage}
                    onPageChange={(page) => setCurPage(page)}
                  />
                </Center>
              )}
            </div>
          </Box>
        </GridItem>
      </Grid>
    )
  }

  const FolderBreadcrumb = () => (
    <VStack>
      <Breadcrumb alignSelf="start" pb="1.25rem">
        {queryParams.mediaDirectoryName
          ? queryParams.mediaDirectoryName.split("%2F").map((dir, idx) => (
              <BreadcrumbItem
                isCurrentPage={
                  idx === queryParams.mediaDirectoryName.split("%2F").length - 1
                }
              >
                <BreadcrumbLink
                  onClick={(e) => {
                    e.preventDefault()
                    setQueryParams((prevState) => ({
                      ...prevState,
                      mediaDirectoryName: getMediaDirectoryName(
                        queryParams.mediaDirectoryName,
                        { end: idx + 1 }
                      ),
                    }))
                  }}
                >
                  {deslugifyDirectory(dir)}
                </BreadcrumbLink>
              </BreadcrumbItem>
            ))
          : null}
      </Breadcrumb>
      <Flex w="100%" justifyContent="space-between" pb="0.25rem">
        {/* Search medias */}
        <Box>
          <Searchbar
            isExpanded
            onSearch={(val) => setSearchedValue(val)}
            placeholder="Press enter to search"
          />
        </Box>
        {/* Upload medias */}
        <Button
          variant="inverse"
          color="interaction.main.default"
          onClick={onUpload}
        >
          Upload new {singularMediaLabel}
        </Button>
      </Flex>
    </VStack>
  )

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="6xl"
      scrollBehavior="inside"
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent padding="0.5rem" paddingTop="1rem" maxHeight="90%">
        {mediaType === "images" ? (
          <>
            <ModalHeader>
              <VStack alignItems="right" gap="1rem">
                <HStack justifyContent="space-between">
                  <Text textStyle="h4">{`Add ${mediaRoom.slice(0, -1)}${
                    fileName ? ` to ${decodeURIComponent(fileName)}` : ""
                  }`}</Text>
                  <ModalCloseButton onClick={onClose} position="static" />
                </HStack>
                <Text textStyle="body-1">
                  You can choose from your {pluralMediaLabel}, upload a new{" "}
                  {singularMediaLabel}, or add {articleLabel}{" "}
                  {singularMediaLabel}. You can organise your {pluralMediaLabel}{" "}
                  in Workspace &gt; {titleCase(pluralMediaLabel)}.
                </Text>
                <Tabs width="100%" index={activeTab} onChange={handleTabChange}>
                  <TabList>
                    <Tab>Choose from {pluralMediaLabel}</Tab>
                    <Tab>Add by url</Tab>
                  </TabList>
                </Tabs>
                {activeTab === 0 && <FolderBreadcrumb />}
              </VStack>
            </ModalHeader>
            <ModalBody>
              <Tabs width="100%" index={activeTab} onChange={handleTabChange}>
                <TabPanels minHeight="16.5rem">
                  <TabPanel>
                    <InternalMediaSelect />
                  </TabPanel>
                  <TabPanel>
                    <Grid h="100%" templateColumns="1fr 1fr">
                      <GridItem
                        borderRight="1px solid"
                        borderColor="base.divider.medium"
                        pr="1.5rem"
                      >
                        {register && (
                          <FormControl isRequired>
                            <Box mb="1.5rem">
                              <Box mb="0.75rem">
                                <FormLabel>URL</FormLabel>
                              </Box>
                              <Input
                                w="100%"
                                id="selectedMediaPath"
                                placeholder="Input a /url or https://..."
                                {...register("selectedMediaPath", {
                                  required: true,
                                })}
                              />
                            </Box>
                            <Box>
                              <Box mb="0.75rem">
                                <FormLabel mb="0">Alt text</FormLabel>
                                <FormLabel.Description color="text.description">
                                  A brief description of your image to improve
                                  accessibility and SEO.
                                </FormLabel.Description>
                              </Box>
                            </Box>
                            <Input
                              w="100%"
                              id="altText"
                              placeholder="Describe your image"
                              {...register("altText", {
                                required: true,
                              })}
                            />
                          </FormControl>
                        )}
                      </GridItem>
                      <GridItem pl="1.5rem">
                        <Text textStyle="subhead-3" alignSelf="start">
                          Preview
                        </Text>
                        <Text textStyle="body-2" alignSelf="start" pb="1rem">
                          The image may appear differently on your actual page.
                        </Text>
                        <Image
                          alt={watch("altText")}
                          src={
                            watch("selectedMediaPath") ||
                            `data:image/svg+xml;base64,${watch(
                              "selectedMediaPath"
                            )}`
                          }
                          fallback={
                            <Flex
                              background="base.canvas.alt"
                              h="25rem"
                              w="40rem"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Text color="base.content.medium">
                                Your image will appear here.
                              </Text>
                            </Flex>
                          }
                        />
                      </GridItem>
                    </Grid>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>

            <ModalFooter>
              <Flex>
                <LoadingButton
                  alignSelf="flex-end"
                  id="selectMedia"
                  isDisabled={
                    !watch("selectedMedia") && !watch("selectedMediaPath")
                  }
                  onClick={handleSubmit((data) => {
                    if (activeTab === 0) onProceed(data)
                    else onExternalProceed(data)
                  })}
                >
                  Select
                </LoadingButton>
              </Flex>
            </ModalFooter>
          </>
        ) : (
          // Files have no external options
          <>
            <ModalHeader>
              <VStack alignItems="right" gap="1rem">
                <HStack justifyContent="space-between">
                  <Text textStyle="h4">{`Add ${mediaRoom.slice(0, -1)}${
                    fileName ? ` to ${decodeURIComponent(fileName)}` : ""
                  }`}</Text>
                  <ModalCloseButton onClick={onClose} position="static" />
                </HStack>
                <Text textStyle="body-1">
                  You can choose from your {pluralMediaLabel}, upload a new{" "}
                  {singularMediaLabel}, or add {articleLabel}{" "}
                  {singularMediaLabel}. You can organise your {pluralMediaLabel}{" "}
                  in Workspace &gt; {titleCase(pluralMediaLabel)}.
                </Text>
                <FolderBreadcrumb />
              </VStack>
            </ModalHeader>
            <ModalBody>
              <InternalMediaSelect />
            </ModalBody>
            <ModalFooter>
              <Flex>
                <LoadingButton
                  alignSelf="flex-end"
                  id="selectMedia"
                  isDisabled={!watch("selectedMedia")}
                  onClick={handleSubmit((data) => {
                    onProceed(data)
                  })}
                >
                  Select
                </LoadingButton>
              </Flex>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export default MediasSelectModal
