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
  const { new: newValue, old: oldValue } = args
  return <DiffViewer newValue={newValue} oldValue={oldValue} />
}
export const Default = Template.bind({})
Default.args = {
  new: NEW_DIFF_VALUE,
  old: OLD_DIFF_VALUE,
}

export const UpperCodeFold = Template.bind({})
UpperCodeFold.args = {
  new: NEW_DIFF_VALUE + NEW_DIFF_VALUE,
  old: NEW_DIFF_VALUE + OLD_DIFF_VALUE,
}

export const LowerCodeFold = Template.bind({})
LowerCodeFold.args = {
  new: NEW_DIFF_VALUE + NEW_DIFF_VALUE,
  old: OLD_DIFF_VALUE + NEW_DIFF_VALUE,
}

export const DualCodeFold = Template.bind({})
DualCodeFold.args = {
  new: NEW_DIFF_VALUE + NEW_DIFF_VALUE + NEW_DIFF_VALUE,
  old: NEW_DIFF_VALUE + OLD_DIFF_VALUE + NEW_DIFF_VALUE,
}

export const UpperCodeFoldWithInitialChanges = Template.bind({})
UpperCodeFoldWithInitialChanges.args = {
  new: `something\n${NEW_DIFF_VALUE}${NEW_DIFF_VALUE}`,
  old: `some\n${NEW_DIFF_VALUE}${OLD_DIFF_VALUE}`,
}
export default diffViewMeta
