import { Meta } from "@storybook/react"
import type { StoryFn } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { SiteLaunchProvider } from "contexts/SiteLaunchContext"

import { buildSiteLaunchDto } from "mocks/utils"

import { SiteLaunchPad } from "./SiteLaunchPad"

const SiteLaunchPadMeta = {
  title: "Pages/SiteLaunchPad",
  component: SiteLaunchPad,
  parameters: {
    msw: {
      handlers: {
        siteLaunchStatusProps: buildSiteLaunchDto({
          siteStatus: "NOT_LAUNCHED",
        }),
      },
    },
  },
  decorators: [
    (StoryFn) => {
      return (
        <MemoryRouter initialEntries={["/sites/storybook/siteLaunchPad"]}>
          <Route path="/sites/:siteName/siteLaunchPad">
            <SiteLaunchProvider>
              <StoryFn />
            </SiteLaunchProvider>
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as Meta<typeof SiteLaunchPad>

const Template: StoryFn<typeof SiteLaunchPad> = (args) => (
  <SiteLaunchPad {...args} />
)

// NOTE: This is just a mock, so no need actual functions
const siteLaunchPadArgs = {
  pageNumber: 1,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setPageNumber: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleDecrementStepNumber: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  handleIncrementStepNumber: () => {},
}

export const Default = Template.bind({})
Default.args = siteLaunchPadArgs

export const siteLaunchDisclaimer = Template.bind({})

siteLaunchDisclaimer.args = {
  ...siteLaunchPadArgs,
  pageNumber: 1,
}

export const siteLaunchInfoGathering = Template.bind({})

siteLaunchInfoGathering.args = {
  ...siteLaunchPadArgs,
  pageNumber: 2,
}

export const siteLaunchRiskAcceptance = Template.bind({})

siteLaunchRiskAcceptance.args = {
  ...siteLaunchPadArgs,
  pageNumber: 3,
}

export const siteLaunchChecklist = Template.bind({})

siteLaunchChecklist.args = {
  ...siteLaunchPadArgs,
  pageNumber: 4,
}

export default SiteLaunchPadMeta
