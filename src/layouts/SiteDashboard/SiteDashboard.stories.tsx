import { ComponentStory, ComponentMeta } from "@storybook/react"
import _ from "lodash"
import { MemoryRouter, Route } from "react-router-dom"

import {
  MOCK_SITE_DASHBOARD_COLLABORATORS_STATISTICS,
  MOCK_SITE_DASHBOARD_INFO,
  MOCK_SITE_DASHBOARD_REVIEW_REQUESTS,
  MOCK_USER,
} from "mocks/constants"
import {
  buildLoginData,
  buildSiteDashboardCollaboratorsStatistics,
  buildSiteDashboardInfo,
  buildSiteDashboardReviewRequests,
} from "mocks/utils"

import { SiteDashboard } from "./SiteDashboard"

const mockReviewRequestsNewPendingReview = _.set(
  _.cloneDeep(MOCK_SITE_DASHBOARD_REVIEW_REQUESTS),
  "[0].firstView",
  true
)
const mockReviewRequestsApproved = _.set(
  _.cloneDeep(MOCK_SITE_DASHBOARD_REVIEW_REQUESTS),
  "[0].status",
  "APPROVED"
)

const SiteDashboardMeta = {
  title: "Pages/SiteDashboard",
  component: SiteDashboard,
  parameters: {
    // Set delay so mock API requests will get resolved and the UI will render properly
    chromatic: { delay: 500 },
    msw: {
      handlers: {
        reviewRequests: buildSiteDashboardReviewRequests(
          MOCK_SITE_DASHBOARD_REVIEW_REQUESTS
        ),
        siteInfo: buildSiteDashboardInfo(MOCK_SITE_DASHBOARD_INFO),
        collaboratorsStatistics: buildSiteDashboardCollaboratorsStatistics(
          MOCK_SITE_DASHBOARD_COLLABORATORS_STATISTICS
        ),
        loginData: buildLoginData(_.set(MOCK_USER, "userId", "")),
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <MemoryRouter initialEntries={["/sites/storybook/dashboard"]}>
          <Route path="/sites/:siteName/dashboard">
            <Story />
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as ComponentMeta<typeof SiteDashboard>

const Template: ComponentStory<typeof SiteDashboard> = SiteDashboard

export const Loading = Template.bind({})
Loading.parameters = {
  msw: {
    handlers: {
      reviewRequests: buildSiteDashboardReviewRequests([], "infinite"),
      siteInfo: buildSiteDashboardInfo(MOCK_SITE_DASHBOARD_INFO, "infinite"),
      collaboratorsStatistics: buildSiteDashboardCollaboratorsStatistics(
        MOCK_SITE_DASHBOARD_COLLABORATORS_STATISTICS,
        "infinite"
      ),
    },
  },
}

export const NoRequests = Template.bind({})
NoRequests.parameters = {
  msw: {
    handlers: {
      reviewRequests: buildSiteDashboardReviewRequests([]),
    },
  },
}

export const NewPendingReview = Template.bind({})
NewPendingReview.parameters = {
  msw: {
    handlers: {
      reviewRequests: buildSiteDashboardReviewRequests(
        mockReviewRequestsNewPendingReview
      ),
    },
  },
}

export const ReviewRequired = Template.bind({})
ReviewRequired.parameters = {
  msw: {
    handlers: {},
  },
}

export const RequestApproved = Template.bind({})
RequestApproved.parameters = {
  msw: {
    handlers: {
      reviewRequests: buildSiteDashboardReviewRequests(
        mockReviewRequestsApproved
      ),
    },
  },
}

export default SiteDashboardMeta
