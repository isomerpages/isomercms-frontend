import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import type { Meta, StoryFn } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { getMediaLabels } from "utils/media"

import { MOCK_MEDIA_SUBDIRECTORY_DATA } from "mocks/constants"
import { handlers } from "mocks/handlers"
import { buildMediaFolderSubdirectoriesData } from "mocks/utils"
import { useSuccessToast } from "utils"

import { MoveMediaModal } from "./MoveMediaModal"

const moveMediaModalMeta = {
  title: "Components/Move Media Modal",
  component: MoveMediaModal,
  decorators: [
    (Story) => {
      return (
        <MemoryRouter
          initialEntries={[
            "/sites/storybook/media/images/mediaDirectory/images",
          ]}
        >
          <Route path="/sites/:siteName/media/:mediaRoom/mediaDirectory/:mediaDirectoryName">
            <Story />
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as Meta<typeof MoveMediaModal>

const moveMediaModalTemplate: StoryFn<typeof MoveMediaModal> = ({
  selectedMedia,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const successToast = useSuccessToast()
  const onProceed = () => {
    successToast({
      id: "storybook-delete-media-success",
      description: "STORYBOOK: Media has been successfully moved",
    })
    onClose()
  }

  return (
    <>
      <Button onClick={onOpen}>Open move media modal</Button>
      <MoveMediaModal
        selectedMedia={selectedMedia}
        mediaType="images"
        mediaLabels={getMediaLabels("images")}
        isWriteDisabled={false}
        isOpen={isOpen}
        isLoading={false}
        onClose={onClose}
        onProceed={onProceed}
      />
    </>
  )
}

export const Default = moveMediaModalTemplate.bind({})
Default.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildMediaFolderSubdirectoriesData(MOCK_MEDIA_SUBDIRECTORY_DATA),
    ],
  },
}
Default.args = {
  selectedMedia: [
    { filePath: "images/hero-banner.png", size: 1234, sha: "sha1234" },
  ],
}

export const MultipleMedia = moveMediaModalTemplate.bind({})
MultipleMedia.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildMediaFolderSubdirectoriesData(MOCK_MEDIA_SUBDIRECTORY_DATA),
    ],
  },
}
MultipleMedia.args = {
  selectedMedia: [
    { filePath: "images/hero-banner.png", size: 1234, sha: "sha1234" },
    { filePath: "images/hero-banner-2.png", size: 2345, sha: "sha2345" },
    { filePath: "images/hero-banner-3.png", size: 3456, sha: "sha3456" },
    { filePath: "images/hero-banner-4.png", size: 4567, sha: "sha4567" },
    { filePath: "images/hero-banner-5.png", size: 5678, sha: "sha5678" },
    { filePath: "images/hero-banner-6.png", size: 6789, sha: "sha6789" },
    { filePath: "images/hero-banner-7.png", size: 7890, sha: "sha7890" },
    { filePath: "images/hero-banner-8.png", size: 8901, sha: "sha8901" },
    { filePath: "images/hero-banner-9.png", size: 9012, sha: "sha9012" },
  ],
}

export default moveMediaModalMeta
