import { HomepageNewFeatures, IsomerThumbsUp } from "assets"
import { IsomerWaitingLine } from "assets/images/IsomerWaitingLine"
import { AnnouncementBatch } from "types/announcements"

import { AnnouncementDescription } from "./components/AnnouncementDescription"

export const ANNOUNCEMENT_BATCH: AnnouncementBatch[] = [
  {
    link: "https://guide.isomer.gov.sg/updates",
    onCloseButtonText: "Done",
    announcements: [
      {
        title: "Control who can edit your website",
        description:
          "Isomer now lets you manage your site’s Collaborators, which includes Admins and Contributors. Only Admins can add or remove these.",
        image: IsomerWaitingLine,
        tags: ["New Feature"],
      },
      {
        title: "Review changes before publishing",
        description:
          "An admin needs to review and approve any changes to your site before they can be published.",
        image: IsomerThumbsUp,
        tags: ["New Feature"],
      },
    ],
  },
  {
    onCloseButtonText: "Got it",
    announcements: [
      {
        title: "Customise your Hero banner with IsomerCMS",
        description: AnnouncementDescription(),
        image: HomepageNewFeatures,
        tags: ["New Feature"],
      },
    ],
  },
]
