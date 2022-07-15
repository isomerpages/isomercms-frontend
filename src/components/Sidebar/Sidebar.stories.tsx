import { ComponentStory, ComponentMeta } from "@storybook/react"
import { rest } from "msw"
import { MemoryRouter, Route } from "react-router-dom"

import { handlers } from "../../mocks/handlers"

import { Sidebar } from "./Sidebar"

const SidebarMeta = {
  title: "Components/Sidebar",
  component: Sidebar,
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
      rest.get(`*/sites/:siteName/lastUpdated`, (req, res, ctx) => {
        return res.networkError("Failed to retrieve user")
      }),
    ],
  },
}

export default SidebarMeta
