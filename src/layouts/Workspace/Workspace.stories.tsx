import { ComponentStory, ComponentMeta } from "@storybook/react"
import axios from "axios"
import { MemoryRouter, Route } from "react-router-dom"

import { ServicesContext } from "contexts/ServicesContext"

import { MOCK_PAGES_DATA, MOCK_DIR_DATA } from "mocks/constants"
import { buildDirData, buildPagesData } from "mocks/utils"

import { contactUsHandler, handlers } from "../../mocks/handlers"

import { Workspace } from "./Workspace"

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL_V2,
  timeout: 100000,
})

const WorkspaceMeta = {
  title: "Pages/Workspace",
  component: Workspace,
  parameters: {
    msw: {
      handlers,
    },
  },
  decorators: [
    (Story) => {
      return (
        <ServicesContext.Provider
          value={{
            pageService: {
              // NOTE: This is a workaround. For reasons unknown, explicitly instantiating a PageService
              // causes the story to crash as the rule of hooks isn't obeyed.
              // As the get method of pageService is only used to call the contact-us endpoint,
              // it is directly inlined here.
              get: () =>
                apiClient
                  .get("/sites/:siteName/pages/contact-us.md")
                  .then(({ data }) => data),
            },
          }}
        >
          <MemoryRouter initialEntries={["/sites/storybook/workspace"]}>
            <Route path="/sites/:siteName/workspace">
              <Story />
            </Route>
          </MemoryRouter>
        </ServicesContext.Provider>
      )
    },
  ],
} as ComponentMeta<typeof Workspace>

const Template: ComponentStory<typeof Workspace> = Workspace

export const Default = Template.bind({})
Default.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildPagesData(MOCK_PAGES_DATA),
      buildDirData(MOCK_DIR_DATA),
      contactUsHandler(true),
    ],
  },
}

export const Empty = Template.bind({})
Empty.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildPagesData([]),
      buildDirData([]),
      contactUsHandler(true),
    ],
  },
}

export const WithoutContactUs = Template.bind({})
WithoutContactUs.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildPagesData(MOCK_PAGES_DATA),
      buildDirData(MOCK_DIR_DATA),
      contactUsHandler(),
    ],
  },
}

export const Loading = Template.bind({})
Loading.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildPagesData(MOCK_PAGES_DATA, "infinite"),
      buildDirData(MOCK_DIR_DATA, "infinite"),
      contactUsHandler(true, "infinite"),
    ],
  },
}

export default WorkspaceMeta
