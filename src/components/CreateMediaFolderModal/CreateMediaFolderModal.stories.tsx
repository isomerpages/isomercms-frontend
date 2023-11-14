import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import type { Meta, StoryFn } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { getMediaLabels } from "utils/media"

import { MOCK_MEDIA_ITEM_DATA, MOCK_MEDIA_ITEM_ONE } from "mocks/constants"
import { handlers } from "mocks/handlers"
import { buildMediaFileData, buildMediaFolderFilesData } from "mocks/utils"
import { useSuccessToast } from "utils"

import { CreateMediaFolderModal } from "./CreateMediaFolderModal"

const createMediaFolderModalMeta = {
  title: "Components/Create Media Folder Modal",
  component: CreateMediaFolderModal,
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
} as Meta<typeof CreateMediaFolderModal>

const createMediaFolderModalTemplate: StoryFn<
  typeof CreateMediaFolderModal
> = ({ originalSelectedMedia }) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const successToast = useSuccessToast()
  const onProceed = async (result: any) => {
    console.log(result)
    successToast({
      id: "storybook-create-media-folder-success",
      description: "STORYBOOK: Media folder has been successfully created",
    })
    onClose()
  }

  return (
    <>
      <Button onClick={onOpen}>Open create media folder modal</Button>
      <CreateMediaFolderModal
        originalSelectedMedia={originalSelectedMedia}
        mediaLabels={getMediaLabels("images")}
        mediaType="images"
        subDirectories={{ directories: [] }}
        mediaDirectoryName="images"
        isOpen={isOpen}
        isLoading={false}
        onClose={onClose}
        onProceed={onProceed}
      />
    </>
  )
}

export const Default = createMediaFolderModalTemplate.bind({})
Default.args = {
  originalSelectedMedia: [],
}
Default.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildMediaFolderFilesData(MOCK_MEDIA_ITEM_DATA),
      buildMediaFileData(MOCK_MEDIA_ITEM_ONE),
    ],
  },
}

export const OneSelected = createMediaFolderModalTemplate.bind({})
OneSelected.args = {
  originalSelectedMedia: [
    { filePath: "/images/hero-banner.png", size: 1234, sha: "sha1234" },
  ],
}

export const MultipleSelected = createMediaFolderModalTemplate.bind({})
MultipleSelected.args = {
  originalSelectedMedia: [
    { filePath: "/images/hero-banner.png", size: 1234, sha: "sha1234" },
    { filePath: "/images/hero-banner2.png", size: 2345, sha: "sha1234" },
  ],
}

export default createMediaFolderModalMeta
