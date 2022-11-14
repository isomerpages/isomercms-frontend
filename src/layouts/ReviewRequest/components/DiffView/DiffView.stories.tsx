import { Story } from "@storybook/react"

import { DiffView, DiffViewProps } from "./DiffView"

const diffViewMeta = {
  title: "Components/ReviewRequest/DiffView",
  component: DiffView,
}
const Template: Story<DiffViewProps> = (args: DiffViewProps) => (
  <DiffView {...args} />
)
export const Default = Template.bind({})
Default.args = {
  fileName: "Some random file",
}

export default diffViewMeta
