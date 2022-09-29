import { ComponentStory, ComponentMeta } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import {
  MOCK_SITE_DASHBOARD_INFO,
  MOCK_SITE_DASHBOARD_REVIEW_REQUESTS,
} from "mocks/constants"
import {
  buildSiteDashboardInfo,
  buildSiteDashboardReviewRequests,
} from "mocks/utils"

import { SiteDashboard } from "./SiteDashboard"

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
    },
  },
}

export const NoRequests = Template.bind({})
NoRequests.parameters = {
  msw: {
    handlers: {
      reviewRequests: buildSiteDashboardReviewRequests([]),
      siteInfo: buildSiteDashboardInfo(MOCK_SITE_DASHBOARD_INFO),
    },
  },
}

export const PendingReview = Template.bind({})
PendingReview.parameters = {
  msw: {
    handlers: {
      reviewRequests: buildSiteDashboardReviewRequests([]),
      siteInfo: buildSiteDashboardInfo(MOCK_SITE_DASHBOARD_INFO),
    },
  },
}

export const ReviewRequired = Template.bind({})
ReviewRequired.parameters = {
  msw: {
    handlers: {
      reviewRequests: buildSiteDashboardReviewRequests([]),
      siteInfo: buildSiteDashboardInfo(MOCK_SITE_DASHBOARD_INFO),
    },
  },
}

export const RequestApproved = Template.bind({})
RequestApproved.parameters = {
  msw: {
    handlers: {
      reviewRequests: buildSiteDashboardReviewRequests([]),
      siteInfo: buildSiteDashboardInfo(MOCK_SITE_DASHBOARD_INFO),
    },
  },
}

export default SiteDashboardMeta
