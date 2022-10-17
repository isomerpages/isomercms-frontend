import { Button, useDisclosure } from "@chakra-ui/react"
import { Story, ComponentMeta } from "@storybook/react"

import { MOCK_ADMINS } from "mocks/constants"

import { SendRequestModal, SendRequestModalProps } from "./SendRequestModal"

const modalMeta = {
  title: "Components/ReviewRequest/Send Request Modal",
  component: SendRequestModal,
} as ComponentMeta<typeof SendRequestModal>
type TemplateProps = Pick<
  SendRequestModalProps,
  "admins" | "reviewUrl" | "reviewTitle" | "siteName"
>

const Template: Story<TemplateProps> = ({
  admins,
  reviewUrl,
  reviewTitle,
  siteName,
}: TemplateProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <SendRequestModal
        admins={admins}
        isOpen={isOpen}
        onClose={onClose}
        reviewUrl={reviewUrl}
        reviewTitle={reviewTitle}
        siteName={siteName}
      />
    </>
  )
}

export const Playground = Template.bind({})
Playground.args = {
  admins: MOCK_ADMINS,
  reviewUrl: "isomer.gov.sg/8201826dnsa0r",
  reviewTitle: "please review my pr here",
  siteName: "a testing site for isomer",
}

export default modalMeta
