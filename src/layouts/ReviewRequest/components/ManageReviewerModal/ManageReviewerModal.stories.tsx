import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { ComponentMeta, Story } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { ReviewRequestRoleProvider } from "contexts/ReviewRequestRoleContext"

import { MOCK_ADMINS, MOCK_REVIEW_REQUEST } from "mocks/constants"
import { buildReviewRequestData } from "mocks/utils"

import {
  ManageReviewerModal,
  ManageReviewerModalProps,
} from "./ManageReviewerModal"

const modalMeta = {
  title: "Components/ReviewRequest/Manage Reviewer Modal",
  component: ManageReviewerModal,
  decorators: [
    (StoryFn) => {
      return (
        <MemoryRouter initialEntries={["/sites/storybook/review/1"]}>
          <Route path="/sites/:siteName/review/:reviewId">
            <ReviewRequestRoleProvider>
              <StoryFn />
            </ReviewRequestRoleProvider>
          </Route>
        </MemoryRouter>
      )
    },
  ],
  parameters: {
    msw: {
      handlers: {
        reviewRequests: buildReviewRequestData({
          reviewRequest: MOCK_REVIEW_REQUEST,
        }),
      },
    },
  },
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
      />
    </>
  )
}

export const Playground = Template.bind({})
Playground.args = {
  admins: MOCK_ADMINS,
  selectedAdmins: [MOCK_ADMINS[0]],
}

export default modalMeta
