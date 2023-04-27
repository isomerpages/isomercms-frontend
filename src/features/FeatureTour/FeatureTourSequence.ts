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

export const STORYBOOK_FEATURE_STEPS: Array<Step> = [
  {
    target: "#isomer-storybook-step-1",
    title: "Some title",
    content:
      "Loerm ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    floaterProps: { placement: "bottom-end" },
    placement: "bottom-end",
  },
  {
    target: "#isomer-storybook-step-2",
    title: "Some title 2",
    content:
      "Loerm ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    placement: "bottom-end",
  },
  {
    target: "#isomer-storybook-step-3",
    title: "Some title 3",
    content:
      "Loerm ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    floaterProps: { placement: "bottom-end" },
    placement: "top-end",
  },
]
