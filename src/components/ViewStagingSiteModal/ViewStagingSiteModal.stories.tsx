import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { Meta } from "@storybook/react"
import type { StoryFn } from "@storybook/react"

import { ViewStagingSiteModal } from "./ViewStagingSiteModal"

const modalMeta = {
  title: "Components/ViewStagingSiteModal",
  component: ViewStagingSiteModal,
} as Meta<typeof ViewStagingSiteModal>

interface TemplateArgs {
  stagingUrl: string
  editMode: boolean
}

const DefaultViewStagingModal: StoryFn<TemplateArgs> = ({
  stagingUrl,
  editMode,
}: TemplateArgs) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <ViewStagingSiteModal
        isOpen={isOpen}
        onClose={onClose}
        isLoading={false}
        stagingUrl={stagingUrl}
        editMode={editMode}
      />
    </>
  )
}

export const EditMode = DefaultViewStagingModal.bind({})
EditMode.args = {
  stagingUrl: "https://staging-isomerpages.com",
  editMode: true,
}

export const ReviewRequestMode = DefaultViewStagingModal.bind({})
ReviewRequestMode.args = {
  stagingUrl: "https://staging-isomerpages.com",
  editMode: false,
}

export default modalMeta
