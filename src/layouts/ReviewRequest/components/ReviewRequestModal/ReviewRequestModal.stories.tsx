import { Button, useDisclosure } from "@chakra-ui/react"
import { Story, ComponentMeta } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { MOCK_ITEMS, MOCK_ADMINS, MOCK_COLLABORATORS } from "mocks/constants"
import { buildCollaboratorData } from "mocks/utils"

import { ReviewRequestModal } from "./ReviewRequestModal"

const modalMeta = {
  title: "Components/ReviewRequest/Modal",
  component: ReviewRequestModal,
  parameters: {
    msw: {
      handlers: {
        collaborators: buildCollaboratorData({
          collaborators: [
            MOCK_COLLABORATORS.ADMIN_1,
            MOCK_COLLABORATORS.CONTRIBUTOR_1,
            MOCK_COLLABORATORS.CONTRIBUTOR_2,
          ],
        }),
      },
    },
  },
} as ComponentMeta<typeof ReviewRequestModal>

const Template: Story = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <MemoryRouter initialEntries={["/sites/storybook"]}>
      <Route path="/sites/:siteName">
        <Button onClick={onOpen}>Open Modal</Button>
        <ReviewRequestModal isOpen={isOpen} onClose={onClose} />
      </Route>
    </MemoryRouter>
  )
}

export const Playground = Template.bind({})
Playground.args = {
  items: MOCK_ITEMS,
  admins: MOCK_ADMINS,
}

export default modalMeta
