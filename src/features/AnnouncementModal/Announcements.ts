import { IsomerThumbsUp } from "assets"
import { IsomerWaitingLine } from "assets/images/IsomerWaitingLine"
import { AnnouncementBatch } from "types/announcements"

export const ANNOUNCEMENT_BATCH: AnnouncementBatch[] = [
  {
    link: "https://guide.isomer.gov.sg/updates",
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
]
