import { ComponentStory, ComponentMeta } from "@storybook/react"
import _ from "lodash"
import { MemoryRouter, Route } from "react-router-dom"

import { SiteLaunchProvider } from "contexts/SiteLaunchContext"

import {
  MOCK_SITE_DASHBOARD_COLLABORATORS_STATISTICS,
  MOCK_SITE_DASHBOARD_INFO,
  MOCK_SITE_DASHBOARD_REVIEW_REQUESTS,
  MOCK_USER,
} from "mocks/constants"
import { updateViewedReviewRequestsHandler } from "mocks/handlers"
import {
  buildCollaboratorData,
  buildCollaboratorRoleData,
  buildLoginData,
  buildSiteDashboardCollaboratorsStatistics,
  buildSiteDashboardInfo,
  buildSiteDashboardReviewRequests,
} from "mocks/utils"
import { SITE_LAUNCH_TASKS_LENGTH } from "types/siteLaunch"

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
        reviewRequests: buildSiteDashboardReviewRequests({
          reviews: MOCK_SITE_DASHBOARD_REVIEW_REQUESTS,
        }),
        siteInfo: buildSiteDashboardInfo(MOCK_SITE_DASHBOARD_INFO),
        collaboratorsStatistics: buildSiteDashboardCollaboratorsStatistics(
          MOCK_SITE_DASHBOARD_COLLABORATORS_STATISTICS
        ),
        loginData: buildLoginData(_.set(MOCK_USER, "userId", "")),
        role: buildCollaboratorRoleData({ role: "ADMIN" }),
        viewed: updateViewedReviewRequestsHandler,
        collaborators: buildCollaboratorData({ collaborators: [] }),
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <MemoryRouter initialEntries={["/sites/storybook/dashboard"]}>
          <Route path="/sites/:siteName/dashboard">
            <SiteLaunchProvider>
              <Story />
            </SiteLaunchProvider>
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
      reviewRequests: buildSiteDashboardReviewRequests(
        { reviews: [] },
        "infinite"
      ),
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
      reviewRequests: buildSiteDashboardReviewRequests({ reviews: [] }),
    },
  },
}

export const NewPendingReview = Template.bind({})
NewPendingReview.parameters = {
  msw: {
    handlers: {
      reviewRequests: buildSiteDashboardReviewRequests({
        reviews: mockReviewRequestsNewPendingReview,
      }),
    },
  },
}

export const ReviewRequired = Template.bind({})

export const RequestApproved = Template.bind({})
RequestApproved.parameters = {
  msw: {
    handlers: {
      reviewRequests: buildSiteDashboardReviewRequests({
        reviews: mockReviewRequestsApproved,
      }),
    },
  },
}

export const SiteLaunchStepsCompleted = Template.bind({})
SiteLaunchStepsCompleted.decorators = [
  (Story) => {
    return (
      <MemoryRouter initialEntries={["/sites/storybook/dashboard"]}>
        <Route path="/sites/:siteName/dashboard">
          <SiteLaunchProvider
            initialSiteLaunchStatus="LAUNCHED"
            initialStepNumber={SITE_LAUNCH_TASKS_LENGTH}
          >
            <Story />
          </SiteLaunchProvider>
        </Route>
      </MemoryRouter>
    )
  },
]

export const SiteLaunchLaunching = Template.bind({})
SiteLaunchLaunching.decorators = [
  (Story) => {
    return (
      <MemoryRouter initialEntries={["/sites/storybook/dashboard"]}>
        <Route path="/sites/:siteName/dashboard">
          <SiteLaunchProvider
            initialSiteLaunchStatus="LAUNCHING"
            initialStepNumber={SITE_LAUNCH_TASKS_LENGTH}
          >
            <Story />
          </SiteLaunchProvider>
        </Route>
      </MemoryRouter>
    )
  },
]

export const SiteLaunchPartialStepsCompleted = Template.bind({})
SiteLaunchPartialStepsCompleted.decorators = [
  (Story) => {
    return (
      <MemoryRouter initialEntries={["/sites/storybook/dashboard"]}>
        <Route path="/sites/:siteName/dashboard">
          <SiteLaunchProvider
            initialSiteLaunchStatus="CHECKLIST_TASKS_PENDING"
            initialStepNumber={1}
          >
            <Story />
          </SiteLaunchProvider>
        </Route>
      </MemoryRouter>
    )
  },
]

export default SiteDashboardMeta
