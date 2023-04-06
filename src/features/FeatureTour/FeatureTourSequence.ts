import { Step } from "react-joyride"

export const FEATURE_STEPS: Array<Step> = [
  {
    target: "#isomer-feature-tour-step-1",
    title: "Edit or preview your site",
    content:
      "Make changes to your site here, or preview a live version on staging",
    floaterProps: { placement: "bottom-end" },
    placement: "bottom-end",
  },
  {
    target: "#isomer-feature-tour-step-2",
    title: "See existing review requests",
    content:
      "If there are any requests yet to be reviewed by an admin, they'll show here",
    placement: "bottom-end",
  },
  {
    target: "#isomer-feature-tour-step-3",
    title: "Manage who can edit your site",
    content:
      "View all collaborators on this site. Admins can also add or remove collaborators here",
    floaterProps: { placement: "top-end" },
    placement: "top-end",
  },
]
