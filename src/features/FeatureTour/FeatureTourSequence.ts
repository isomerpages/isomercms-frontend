import { Step } from "react-joyride"

export const DASHBOARD_FEATURE_STEPS: Array<Step> = [
  {
    target: "#isomer-dashboard-feature-tour-step-1",
    title: "Edit or preview your site",
    content:
      "Make changes to your site here, or preview a live version on staging",
    floaterProps: { placement: "bottom-end" },
    placement: "bottom-end",
  },
  {
    target: "#isomer-dashboard-feature-tour-step-2",
    title: "See existing review requests",
    content:
      "If there are any requests yet to be reviewed by an admin, they'll show here",
    placement: "bottom-end",
  },
  {
    target: "#isomer-dashboard-feature-tour-step-3",
    title: "Manage who can edit your site",
    content:
      "View all collaborators on this site. Admins can also add or remove collaborators here",
    floaterProps: { placement: "top-end" },
    placement: "top-end",
  },
]

export const WORKSPACE_FEATURE_STEPS: Array<Step> = [
  {
    target: "#isomer-workspace-feature-tour-step-1",
    title: "Request an admin to review changes",
    content:
      "This used to be labelled ‘Pull Request’ when approvals required logging in to GitHub. Approvals now happen entirely on Isomer.",
    floaterProps: { placement: "bottom" },
    placement: "bottom",
  },
]
