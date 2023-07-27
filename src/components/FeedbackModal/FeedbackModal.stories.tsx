import { Meta, StoryFn } from "@storybook/react"

import { FeedbackModal, FeedbackModalProps } from "./FeedbackModal"

const FeedbackModalMeta = {
  title: "Components/FeedbackModal",
  component: FeedbackModal,
} as Meta<typeof FeedbackModal>

const Template: StoryFn<typeof FeedbackModal> = ({
  onClose,
}: FeedbackModalProps) => {
  return <FeedbackModal isOpen onClose={onClose} />
}

export const Default = Template.bind({})
Default.parameters = { onClose: console.log }

export default FeedbackModalMeta
