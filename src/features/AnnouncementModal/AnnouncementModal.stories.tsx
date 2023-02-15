import { Meta, Story } from "@storybook/react"

import { AnnouncementModal } from "./AnnouncementModal"
import { ANNOUNCEMENTS } from "./Announcements"

export default {
  title: "Pages/Announcement Modal",
  parameters: {
    layout: "fullscreen",
    // Prevent flaky tests due to modal animating in.
    chromatic: { delay: 200 },
  },
} as Meta

const onClose = () => {
  console.log("closed")
}

const Template: Story = () => (
  <AnnouncementModal
    onClose={onClose}
    isOpen
    announcements={ANNOUNCEMENTS[0].announcements}
    link={ANNOUNCEMENTS[0].link}
  />
)

export const BasicUsage = Template.bind({})
