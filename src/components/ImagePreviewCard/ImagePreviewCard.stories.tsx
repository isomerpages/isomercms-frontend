import type { Meta, StoryFn } from "@storybook/react"
import { useState } from "react"

import { ImagePreviewCard, ImagePreviewCardProps } from "./ImagePreviewCard"

const imagePreviewCardMeta = {
  title: "Components/Image Preview Card",
  component: ImagePreviewCard,
} as Meta<typeof ImagePreviewCard>

type ImagePreviewCardTemplateArgs = ImagePreviewCardProps

const Template: StoryFn<ImagePreviewCardTemplateArgs> = ({
  isSelected: discardedSelected,
  onCheck: discardedCheck,
  ...props
}: ImagePreviewCardTemplateArgs) => {
  const [isSelected, setIsSelected] = useState(false)

  return (
    <ImagePreviewCard
      isSelected={isSelected}
      onCheck={() => {
        setIsSelected(!isSelected)
        console.log(!isSelected)
      }}
      {...props}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  name: "filename.png",
  addedTime: 1693217477000,
  mediaUrl: "https://placehold.co/600x400",
  isMenuNeeded: true,
}

export default imagePreviewCardMeta
