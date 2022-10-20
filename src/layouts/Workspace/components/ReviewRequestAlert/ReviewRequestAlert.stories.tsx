import { ComponentMeta, Story } from "@storybook/react"

import {
  ReviewRequestAlert,
  ReviewRequestAlertProps,
} from "./ReviewRequestAlert"

const alertMeta = {
  title: "Components/ReviewRequest/Review In Progress Alert",
  component: ReviewRequestAlert,
} as ComponentMeta<typeof ReviewRequestAlert>

const Template: Story<ReviewRequestAlertProps> = ({
  reviewRequestUrl,
}: ReviewRequestAlertProps): JSX.Element => {
  return <ReviewRequestAlert reviewRequestUrl={reviewRequestUrl} />
}

export const Default = Template.bind({})
Default.args = {
  reviewRequestUrl: "https://www.google.com",
}

export default alertMeta
