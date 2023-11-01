import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import type { Meta, StoryFn } from "@storybook/react"

import { getMediaLabels } from "utils/media"

import { useSuccessToast } from "utils"

import { DeleteMediaModal } from "./DeleteMediaModal"

const deleteMediaModalMeta = {
  title: "Components/Delete Media Modal",
  component: DeleteMediaModal,
} as Meta<typeof DeleteMediaModal>

const deleteMediaModalTemplate: StoryFn<typeof DeleteMediaModal> = ({
  selectedMedia,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const successToast = useSuccessToast()
  const onProceed = () => {
    successToast({
      id: "storybook-delete-media-success",
      description: "STORYBOOK: Media has been successfully deleted",
    })
    onClose()
  }

  return (
    <>
      <Button onClick={onOpen}>Open delete media modal</Button>
      <DeleteMediaModal
        selectedMedia={selectedMedia}
        mediaLabels={getMediaLabels("images")}
        isWriteDisabled={false}
        isOpen={isOpen}
        onClose={onClose}
        onProceed={onProceed}
      />
    </>
  )
}

export const Default = deleteMediaModalTemplate.bind({})
Default.args = {
  selectedMedia: [
    { filePath: "/images/hero-banner.png", size: 1234, sha: "sha1234" },
  ],
}

export const MultipleMedia = deleteMediaModalTemplate.bind({})
MultipleMedia.args = {
  selectedMedia: [
    { filePath: "/images/hero-banner.png", size: 1234, sha: "sha1234" },
    { filePath: "/images/hero-banner-2.png", size: 2345, sha: "sha2345" },
    { filePath: "/images/hero-banner-3.png", size: 3456, sha: "sha3456" },
    { filePath: "/images/hero-banner-4.png", size: 4567, sha: "sha4567" },
    { filePath: "/images/hero-banner-5.png", size: 5678, sha: "sha5678" },
    { filePath: "/images/hero-banner-6.png", size: 6789, sha: "sha6789" },
    { filePath: "/images/hero-banner-7.png", size: 7890, sha: "sha7890" },
    { filePath: "/images/hero-banner-8.png", size: 8901, sha: "sha8901" },
    { filePath: "/images/hero-banner-9.png", size: 9012, sha: "sha9012" },
  ],
}

export default deleteMediaModalMeta
