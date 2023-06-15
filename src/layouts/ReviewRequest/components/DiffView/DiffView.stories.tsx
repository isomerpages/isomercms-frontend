import { Story } from "@storybook/react"

import { NEW_DIFF_VALUE, OLD_DIFF_VALUE } from "mocks/constants"
import { BlobDiff } from "types/reviewRequest"

import { DiffViewer } from "./DiffView"

const diffViewMeta = {
  title: "Components/ReviewRequest/DiffView",
  component: DiffViewer,
}
type TemplateProps = BlobDiff

const Template: Story<TemplateProps> = (args: TemplateProps) => {
  const { newValue, oldValue } = args
  return <DiffViewer newValue={newValue} oldValue={oldValue} />
}
export const Default = Template.bind({})
Default.args = {
  newValue: NEW_DIFF_VALUE,
  oldValue: OLD_DIFF_VALUE,
}

export const UpperCodeFold = Template.bind({})
UpperCodeFold.args = {
  newValue: [NEW_DIFF_VALUE, NEW_DIFF_VALUE].join("\n"),
  oldValue: [NEW_DIFF_VALUE, OLD_DIFF_VALUE].join("\n"),
}

export const LowerCodeFold = Template.bind({})
LowerCodeFold.args = {
  newValue: [NEW_DIFF_VALUE, NEW_DIFF_VALUE].join("\n"),
  oldValue: [OLD_DIFF_VALUE, NEW_DIFF_VALUE].join("\n"),
}

export const DualCodeFold = Template.bind({})
DualCodeFold.args = {
  newValue: [NEW_DIFF_VALUE, NEW_DIFF_VALUE, NEW_DIFF_VALUE].join("\n"),
  oldValue: [NEW_DIFF_VALUE, OLD_DIFF_VALUE, NEW_DIFF_VALUE].join("\n"),
}

export const UpperCodeFoldWithInitialChanges = Template.bind({})
UpperCodeFoldWithInitialChanges.args = {
  newValue: `something\n${NEW_DIFF_VALUE}${NEW_DIFF_VALUE}`,
  oldValue: `some\n${NEW_DIFF_VALUE}${OLD_DIFF_VALUE}`,
}
export default diffViewMeta
