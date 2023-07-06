import { ComponentMeta, Story } from "@storybook/react"
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
} as ComponentMeta<typeof SiteLaunchPad>

const Template = SiteLaunchPad
export const Default: Story = Template.bind({})
export default SiteLaunchPadMeta
