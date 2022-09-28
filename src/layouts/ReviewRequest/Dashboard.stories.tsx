import { ComponentMeta, Story } from "@storybook/react"

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
}

export default dashboardMeta
