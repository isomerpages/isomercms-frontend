import { ComponentMeta, Story } from "@storybook/react"

import { MOCK_ITEMS } from "mocks/constants"
import { buildMarkCommentsAsReadData } from "mocks/utils"

import { handlers } from "../../mocks/handlers"

import {
  ReviewRequestDashboard,
  ReviewRequestDashboardProps,
} from "./Dashboard"

const dashboardMeta = {
  title: "Components/ReviewRequest/Dashboard",
  component: ReviewRequestDashboard,
} as ComponentMeta<typeof ReviewRequestDashboard>

const Template = ReviewRequestDashboard

export const Playground: Story<ReviewRequestDashboardProps> = Template.bind({})
Playground.args = {
  reviewRequestedTime: new Date(),
  reviewUrl: "Copied to your clipboard kekw",
  title: "Update STCCED hyperlink, customs duty",
  requestor: "seaerchin",
  reviewers: ["nat mae tan", "jiachin er"],
  changedItems: MOCK_ITEMS,
}
Playground.parameters = {
  msw: {
    handlers: [...handlers, buildMarkCommentsAsReadData([])],
  },
}

export default dashboardMeta
