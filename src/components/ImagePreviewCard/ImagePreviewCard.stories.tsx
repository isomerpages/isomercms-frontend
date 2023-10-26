import type { Meta, StoryFn } from "@storybook/react"

import { ImagePreviewCard, ImagePreviewCardProps } from "./ImagePreviewCard"

const imagePreviewCardMeta = {
  title: "Components/Image Preview Card",
  component: ImagePreviewCard,
} as Meta<typeof ImagePreviewCard>

type ImagePreviewCardTemplateArgs = ImagePreviewCardProps

const Template: StoryFn<ImagePreviewCardTemplateArgs> = (
  props: ImagePreviewCardTemplateArgs
) => {
  return <ImagePreviewCard {...props} />
}

export const Default = Template.bind({})
Default.args = {
  name: "filename.png",
  addedTime: 1693217477000,
  mediaUrl: "https://placehold.co/600x400",
  isMenuNeeded: true,
  onCheck: (e) => console.log(e.target.checked),
}

export default imagePreviewCardMeta
