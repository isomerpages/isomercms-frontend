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
} from "@chakra-ui/react"
import {
  Button,
  Searchbar,
  Pagination,
  Breadcrumb,
} from "@opengovsg/design-system-react"
import { useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import { useRouteMatch } from "react-router-dom"

import { ImagePreviewCard } from "components/ImagePreviewCard"
import { LoadingButton } from "components/LoadingButton"

import { MEDIA_PAGINATION_SIZE } from "constants/media"

import { useGetAllMediaFiles } from "hooks/directoryHooks/useGetAllMediaFiles"
import { useListMediaFolderFiles } from "hooks/directoryHooks/useListMediaFolderFiles"
import { useListMediaFolderSubdirectories } from "hooks/directoryHooks/useListMediaFolderSubdirectories"
import { usePaginate } from "hooks/usePaginate"

import { FilePreviewCard, MediaDirectoryCard } from "layouts/Media/components"

import mediaStyles from "styles/isomer-cms/pages/Media.module.scss"

import { getMediaLabels } from "utils/media"

import { deslugifyDirectory, getMediaDirectoryName } from "utils"

const filterMediaByFileName = (medias, filterTerm) =>
  medias.filter((media) =>
    media.name.toLowerCase().includes(filterTerm.toLowerCase())
  )

const titleCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const MediasSelectModal = ({
  onProceed,
  onClose,
  onMediaSelect,
  onUpload,
  queryParams,
  setQueryParams,
  mediaType,
}) => {
  const { params } = useRouteMatch()
  const { fileName } = params

  const { singularMediaLabel, pluralMediaLabel } = getMediaLabels(mediaType)

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

  const { watch, handleSubmit } = useFormContext()
  return (
    <Modal
      isOpen
      onClose={onClose}
      size="6xl"
      scrollBehavior="inside"
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent padding="0.5rem" paddingTop="1rem">
        <ModalHeader>
          <VStack alignItems="right" gap="1rem">
            <HStack justifyContent="space-between">
              <Text textStyle="h4">{`Add ${mediaRoom.slice(0, -1)}${
                fileName ? ` to ${decodeURIComponent(fileName)}` : ""
              }`}</Text>
              <ModalCloseButton onClick={onClose} position="static" />
            </HStack>
            <Text textStyle="body-1">
              Choose from your {pluralMediaLabel} or upload a new{" "}
              {singularMediaLabel}. You can organise your {pluralMediaLabel} in
              Workspace &gt; {titleCase(pluralMediaLabel)}.
            </Text>
            <Flex w="100%" justifyContent="space-between">
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
        </ModalHeader>
        <ModalBody>
          <Breadcrumb pb="1.25rem">
            {queryParams.mediaDirectoryName
              ? queryParams.mediaDirectoryName.split("%2F").map((dir, idx) => (
                  <BreadcrumbItem
                    isCurrentPage={
                      idx ===
                      queryParams.mediaDirectoryName.split("%2F").length - 1
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
          <div
            className={`${mediaStyles.mediaCards} justify-content-center pt-3 pl-2`}
          >
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
              <SimpleGrid w="100%" columns={3} spacing="1.5rem">
                {/* Directories */}
                {filteredDirectories.map((dir) => (
                  <MediaDirectoryCard
                    title={dir.name}
                    onClick={() => {
                      onMediaSelect("")
                      setQueryParams((prevState) => {
                        return {
                          ...prevState,
                          mediaDirectoryName: `${prevState.mediaDirectoryName}%2F${dir.name}`,
                        }
                      })
                    }}
                    isMenuNeeded={false}
                  />
                ))}
              </SimpleGrid>
            </Skeleton>

            <Skeleton
              w="100%"
              h={isListMediaFilesLoading ? "4.5rem" : "fit-content"}
              isLoaded={!isListMediaFilesLoading}
            >
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
          </div>
        </ModalBody>

        <ModalFooter>
          <VStack w="100%">
            {files && mediaFolderFiles && total > 0 && (
              <Center w="100%">
                <Pagination
                  totalCount={total}
                  pageSize={MEDIA_PAGINATION_SIZE}
                  currentPage={curPage}
                  onPageChange={(page) => setCurPage(page)}
                />
              </Center>
            )}
            <LoadingButton
              alignSelf="flex-end"
              id="selectMedia"
              isDisabled={!watch("selectedMedia")}
              onClick={handleSubmit((data) => onProceed(data))}
            >
              Select
            </LoadingButton>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default MediasSelectModal
