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
  Spacer,
  Divider,
} from "@chakra-ui/react"
import { Button, Searchbar, Pagination } from "@opengovsg/design-system-react"
import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Link, useRouteMatch } from "react-router-dom"

import { FolderCard } from "components/FolderCard"
import { BreadcrumbItem } from "components/folders/Breadcrumb"
import { LoadingButton } from "components/LoadingButton"
import MediaCard from "components/media/MediaCard"

import { useGetAllMediaFiles } from "hooks/directoryHooks/useGetAllMediaFiles"
import { useListMediaFolderFiles } from "hooks/directoryHooks/useListMediaFolderFiles"
import { useListMediaFolderSubdirectories } from "hooks/directoryHooks/useListMediaFolderSubdirectories"
import { usePaginate } from "hooks/usePaginate"

import contentStyles from "styles/isomer-cms/pages/Content.module.scss"
import mediaStyles from "styles/isomer-cms/pages/Media.module.scss"

import { deslugifyDirectory, getMediaDirectoryName } from "utils"

import { MEDIA_PAGINATION_SIZE } from "../../constants/pagination"

const filterMediaByFileName = (medias, filterTerm) =>
  medias.filter((media) =>
    media.name.toLowerCase().includes(filterTerm.toLowerCase())
  )

const MediasSelectModal = ({
  onProceed,
  onClose,
  onMediaSelect,
  onUpload,
  queryParams,
  setQueryParams,
}) => {
  const { params } = useRouteMatch()
  const { siteName } = params

  const { mediaRoom } = queryParams

  const [curPage, setCurPage] = usePaginate()

  const {
    data: { directories: mediaFolderSubdirectories },
    isLoading: isListMediaFolderSubdirectoriesLoading,
  } = useListMediaFolderSubdirectories(
    {
      ...queryParams,
    },
    { initialData: { directories: [] } }
  )

  const {
    data: { files: mediaFolderFiles, total },
    isLoading: isListMediaFilesLoading,
  } = useListMediaFolderFiles(
    {
      ...queryParams,
      // NOTE: Subtracting 1 here because `usePaginate`
      // returns an index with 1 offset
      curPage: curPage - 1,
    },
    { initialData: { files: [] } }
  )

  const files = useGetAllMediaFiles(
    mediaFolderFiles || [],
    params.siteName,
    mediaRoom
  )

  const [searchValue, setSearchedValue] = useState("")
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
      <ModalContent>
        <ModalHeader>
          <Flex mr="3rem">
            <Text textStyle="h1">{`Select ${mediaRoom.slice(0, -1)}`}</Text>
            <Spacer />
            {/* Search medias */}
            <Box w="33%" px="1rem">
              <Searchbar isExpanded onSearch={(val) => setSearchedValue(val)} />
            </Box>
            {/* Upload medias */}
            <Button onClick={onUpload} mr={2}>
              Add new
            </Button>
          </Flex>
        </ModalHeader>
        <ModalCloseButton onClick={onClose} />
        <ModalBody>
          <Divider mb="0.75rem" />
          <div className={`${contentStyles.segment} mb-0`}>
            <p>
              For {mediaRoom} other than
              {mediaRoom === "images"
                ? ` 'png', 'jpg', '.jpeg', 'gif', 'tif', '.tiff', 'bmp', 'ico', 'svg'`
                : ` 'pdf'`}
              , please use
              <Link to={{ pathname: `https://go.gov.sg` }} target="_blank">
                https://go.gov.sg
              </Link>
              to upload and link them to your Isomer site.
            </p>
          </div>
          <div className={`${contentStyles.segment} mb-3`}>
            {queryParams.mediaDirectoryName
              ? queryParams.mediaDirectoryName.split("%2F").map((dir, idx) => (
                  <BreadcrumbItem
                    item={deslugifyDirectory(dir)}
                    isLast={
                      idx ===
                      queryParams.mediaDirectoryName.split("%2F").length - 1
                    }
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
                  />
                ))
              : null}
          </div>
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
            >
              <div className={contentStyles.folderContainerBoxes}>
                <div className={contentStyles.boxesContainer}>
                  {/* Directories */}
                  {filteredDirectories.map((dir) => (
                    <FolderCard
                      displayText={dir.name}
                      siteName={siteName}
                      onClick={() =>
                        setQueryParams((prevState) => {
                          return {
                            ...prevState,
                            mediaDirectoryName: `${prevState.mediaDirectoryName}%2F${dir.name}`,
                          }
                        })
                      }
                      key={dir.path}
                      hideSettings
                    />
                  ))}
                </div>
              </div>
            </Skeleton>

            <Skeleton
              w="100%"
              h={isListMediaFilesLoading ? "4.5rem" : "fit-content"}
              isLoaded={!isListMediaFilesLoading}
            >
              <SimpleGrid w="100%" columns={3} spacing="2.5%">
                {files
                  .filter(({ data }) => filteredMedias.includes(data?.name))
                  .map(({ data, isLoading }, mediaItemIndex) => (
                    <Skeleton
                      w="100%"
                      h={isLoading ? "4.5rem" : "fit-content"}
                      isLoaded={!isLoading}
                      key={data.name}
                    >
                      <MediaCard
                        type={mediaRoom}
                        media={data}
                        mediaItemIndex={mediaItemIndex}
                        onClick={() => onMediaSelect(data)}
                        isSelected={data.name === watch("selectedMedia")?.name}
                        showSettings={false}
                      />
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
