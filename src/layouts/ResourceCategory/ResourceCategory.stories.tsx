import { ComponentStory, ComponentMeta } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import {
  MOCK_RESOURCE_CATEGORY_NAME,
  MOCK_RESOURCE_CATEGORY_PAGES_DATA,
  MOCK_RESOURCE_ROOM_NAME,
} from "mocks/constants"
import { buildResourceCategoryData } from "mocks/utils"

import { handlers } from "../../mocks/handlers"

import { ResourceCategory } from "./ResourceCategory"

const ResourceCategoryMeta = {
  title: "Pages/ResourceCategory",
  component: ResourceCategory,
  parameters: {
    // Set delay so mock API requests will get resolved and the UI will render properly
    chromatic: { delay: 300 },
    msw: {
      handlers: {
        resourceCategoryData: buildResourceCategoryData(
          MOCK_RESOURCE_CATEGORY_PAGES_DATA
        ),
        rest: handlers,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <MemoryRouter
          initialEntries={[
            `/sites/storybook/resourceRoom/${MOCK_RESOURCE_ROOM_NAME}/resourceCategory/${MOCK_RESOURCE_CATEGORY_NAME}`,
          ]}
        >
          <Route path="/sites/:siteName/resourceRoom/:resourceRoomName/resourceCategory/:resourceCategoryName">
            <Story />
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as ComponentMeta<typeof ResourceCategory>

const Template: ComponentStory<typeof ResourceCategory> = ResourceCategory

export const Default = Template.bind({})

export const Empty = Template.bind({})
Empty.parameters = {
  msw: {
    handlers: {
      resourceCategoryData: buildResourceCategoryData([]),
    },
  },
}

export const Loading = Template.bind({})
Loading.parameters = {
  msw: {
    handlers: {
      resourceCategoryData: buildResourceCategoryData([], "infinite"),
    },
  },
}

export default ResourceCategoryMeta
