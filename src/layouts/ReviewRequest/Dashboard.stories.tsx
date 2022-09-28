import { ComponentMeta, Story } from "@storybook/react"

import { MOCK_ITEMS } from "mocks/constants"

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
  siteName: "MOCK_ADMINS",
  reviewUrl: "Copied to your clipboard kekw",
  title: "Update STCCED hyperlink, customs duty",
  requestor: "seaerchin",
  reviewers: ["nat mae tan", "jiachin er"],
  changedItems: MOCK_ITEMS,
}

export default dashboardMeta
