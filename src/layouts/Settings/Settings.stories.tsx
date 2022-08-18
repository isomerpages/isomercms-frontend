import { ComponentStory, ComponentMeta } from "@storybook/react"
import { pick } from "lodash"
import { MemoryRouter, Route } from "react-router-dom"

import { MOCK_BE_SETTINGS } from "mocks/constants"
import { buildSettingsData } from "mocks/utils"

import { handlers } from "../../mocks/handlers"

import { Settings } from "./Settings"

const SettingsMeta = {
  title: "Pages/Settings",
  component: Settings,
  parameters: {
    // Set delay so mock API requests will get resolved and the UI will render properly
    chromatic: { delay: 500 },
    msw: {
      handlers: {
        settingsData: buildSettingsData(MOCK_BE_SETTINGS),
        rest: handlers,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <MemoryRouter initialEntries={["/sites/storybook/settings"]}>
          <Route path="/sites/:siteName/settings">
            <Story />
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as ComponentMeta<typeof Settings>

const Template: ComponentStory<typeof Settings> = Settings

export const Default = Template.bind({})

export const Empty = Template.bind({})
Empty.parameters = {
  msw: {
    handlers: {
      // NOTE: Only colors is guaranteed to be returned from the BE
      settingsData: buildSettingsData(pick(MOCK_BE_SETTINGS, "colors")),
    },
  },
}

export const Loading = Template.bind({})
Loading.parameters = {
  msw: {
    handlers: {
      settingsData: buildSettingsData(MOCK_BE_SETTINGS, "infinite"),
    },
  },
}

export default SettingsMeta
