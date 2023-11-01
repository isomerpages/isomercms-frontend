import { Meta, StoryFn } from "@storybook/react"

import { AnnouncementModal, AnnouncementModalProps } from "./AnnouncementModal"
import { ANNOUNCEMENT_BATCH } from "./Announcements"

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

const Template: StoryFn<typeof AnnouncementModal> = (
  args: AnnouncementModalProps
) => <AnnouncementModal {...args} />

export const SiteCollaboratorsAnnouncement = Template.bind({})
SiteCollaboratorsAnnouncement.args = {
  onClose,
  isOpen: true,
  announcements: ANNOUNCEMENT_BATCH[0].announcements,
  link: ANNOUNCEMENT_BATCH[0].link,
  onCloseButtonText: ANNOUNCEMENT_BATCH[0].onCloseButtonText,
}

export const HeroBannerNewFeaturesAnnouncement = Template.bind({})
HeroBannerNewFeaturesAnnouncement.args = {
  onClose,
  isOpen: true,
  announcements: ANNOUNCEMENT_BATCH[1].announcements,
  onCloseButtonText: ANNOUNCEMENT_BATCH[1].onCloseButtonText,
}

export const BulkUploadingAnnouncement = Template.bind({})
BulkUploadingAnnouncement.args = {
  onClose,
  isOpen: true,
  announcements: ANNOUNCEMENT_BATCH[2].announcements,
  onCloseButtonText: ANNOUNCEMENT_BATCH[2].onCloseButtonText,
}
