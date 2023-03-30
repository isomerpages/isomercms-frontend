import { ComponentMeta, Story } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { ReviewRequestRoleProvider } from "contexts/ReviewRequestRoleContext"

import { MOCK_COLLABORATORS, MOCK_REVIEW_REQUEST } from "mocks/constants"
import {
  buildCollaboratorData,
  buildCommentsData,
  buildMarkCommentsAsReadData,
  buildReviewRequestData,
} from "mocks/utils"

import { markReviewRequestAsViewedHandler } from "../../mocks/handlers"

import { ReviewRequestDashboard } from "./Dashboard"

const dashboardMeta = {
  title: "Pages/ReviewRequest",
  component: ReviewRequestDashboard,
  parameters: {
    msw: {
      handlers: {
        reviewRequest: buildReviewRequestData({
          reviewRequest: MOCK_REVIEW_REQUEST,
        }),
        viewed: markReviewRequestAsViewedHandler,
        comments: [buildMarkCommentsAsReadData([]), buildCommentsData([])],
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
  decorators: [
    (StoryFn) => (
      <MemoryRouter initialEntries={["/sites/storybook/review/1"]}>
        <Route path="/sites/:siteName/review/:reviewId">
          <ReviewRequestRoleProvider>
            <StoryFn />
          </ReviewRequestRoleProvider>
        </Route>
      </MemoryRouter>
    ),
  ],
} as ComponentMeta<typeof ReviewRequestDashboard>

const Template = ReviewRequestDashboard

export const Default: Story = Template.bind({})

export const Loading: Story = Template.bind({})
Loading.parameters = {
  msw: {
    handlers: {
      reviewRequest: buildReviewRequestData(
        {
          reviewRequest: MOCK_REVIEW_REQUEST,
        },
        "infinite"
      ),
    },
  },
}
export default dashboardMeta
