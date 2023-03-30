import { ComponentStory, ComponentMeta } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { MOCK_SITES_DATA } from "mocks/constants"
import { buildAllSitesData } from "mocks/utils"

import { handlers } from "../mocks/handlers"

import { Sites } from "./Sites"

const SitesMeta = {
  title: "Pages/Sites",
  component: Sites,
  parameters: {
    // Set delay so mock API requests will get resolved and the UI will render properly
    chromatic: { delay: 500 },
    msw: {
      handlers: {
        sitesData: buildAllSitesData(MOCK_SITES_DATA),
        rest: handlers,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <MemoryRouter initialEntries={["/sites/storybook/sites"]}>
          <Route path="/sites">
            <Story />
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as ComponentMeta<typeof Sites>

const Template: ComponentStory<typeof Sites> = Sites

export const Default = Template.bind({})

export const Empty = Template.bind({})
Empty.parameters = {
  msw: {
    handlers: {
      sitesData: buildAllSitesData({ siteNames: [] }),
    },
  },
}

export const Loading = Template.bind({})
Loading.parameters = {
  msw: {
    handlers: {
      sitesData: buildAllSitesData(MOCK_SITES_DATA, "infinite"),
    },
  },
}

export default SitesMeta
