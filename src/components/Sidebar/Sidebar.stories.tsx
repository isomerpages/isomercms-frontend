import { ComponentStory, ComponentMeta } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { MOCK_USER } from "mocks/constants"
import { buildLastUpdated, buildLoginData } from "mocks/utils"

import { handlers } from "../../mocks/handlers"

import { Sidebar } from "./Sidebar"

const SidebarMeta = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: {
    chromatic: {
      delay: 500,
    },
  },
  decorators: [
    (Story) => {
      return (
        <MemoryRouter initialEntries={["/sites/storybook/workspace"]}>
          <Route path="/sites/:siteName/workspace">
            <Story />
          </Route>
          <Route path="/sites/:siteName/resourceRoom">
            <Story />
          </Route>
          <Route path="/sites/:siteName/settings">
            <Story />
          </Route>
          <Route path="/sites/:siteName/media/files">
            <Story />
          </Route>
          <Route path="/sites/:siteName/media/images">
            <Story />
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as ComponentMeta<typeof Sidebar>

const Template: ComponentStory<typeof Sidebar> = () => {
  return <Sidebar />
}

export const Default = Template.bind({})
Default.parameters = {
  msw: {
    handlers,
  },
}

export const Error = Template.bind({})
Error.parameters = {
  msw: {
    handlers: [
      buildLoginData({
        userId: "Unknown user",
        email: "",
        contactNumber: "",
        accountName: "Unknown user",
      }),
    ],
  },
}

export const Loading = Template.bind({})
Loading.parameters = {
  msw: {
    handlers: [
      buildLastUpdated({ lastUpdated: "Last updated today" }, "infinite"),
      buildLoginData(MOCK_USER),
    ],
  },
}

export default SidebarMeta
