import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { ComponentMeta, Story } from "@storybook/react"

import { MOCK_ADMINS } from "mocks/constants"

import {
  ManageReviewerModal,
  ManageReviewerModalProps,
} from "./ManageReviewerModal"

const modalMeta = {
  title: "Components/ReviewRequest/Manage Reviewer Modal",
  component: ManageReviewerModal,
} as ComponentMeta<typeof ManageReviewerModal>

type TemplateProps = Pick<ManageReviewerModalProps, "selectedAdmins" | "admins">

const Template: Story<TemplateProps> = ({
  selectedAdmins,
  admins,
}: TemplateProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <ManageReviewerModal
        selectedAdmins={selectedAdmins}
        admins={admins}
        isOpen={isOpen}
        onClose={onClose}
      >
        <Button colorScheme="danger">Click me</Button>
      </ManageReviewerModal>
    </>
  )
}

export const Playground = Template.bind({})
Playground.args = {
  admins: MOCK_ADMINS,
  selectedAdmins: [MOCK_ADMINS[0]],
}

export default modalMeta
