import { ComponentStory, ComponentMeta } from "@storybook/react"
import { MemoryRouter, Route, Switch } from "react-router-dom"

import { MOCK_DIR_DATA, MOCK_RESOURCE_ROOM_NAME } from "mocks/constants"
import { buildResourceRoomData, buildResourceRoomName } from "mocks/utils"

import { handlers } from "../../mocks/handlers"

import { ResourceRoom } from "./ResourceRoom"

const ResourceRoomMeta = {
  title: "Pages/ResourceRoom",
  component: ResourceRoom,
  parameters: {
    // Set delay so mock API requests will get resolved and the UI will render properly
    chromatic: { delay: 500 },
    msw: {
      handlers: {
        resourceRoomName: buildResourceRoomName({
          resourceRoomName: MOCK_RESOURCE_ROOM_NAME,
        }),
        resourceRoomData: buildResourceRoomData(MOCK_DIR_DATA),
        rest: handlers,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <MemoryRouter
          initialEntries={[
            `/sites/storybook/resourceRoom/${MOCK_RESOURCE_ROOM_NAME}`,
          ]}
        >
          <Switch>
            <Route path="/sites/:siteName/resourceRoom/:resourceRoomName">
              <Story />
            </Route>
            <Route path="/sites/:siteName/resourceRoom/">
              <Story />
            </Route>
          </Switch>
        </MemoryRouter>
      )
    },
  ],
} as ComponentMeta<typeof ResourceRoom>

const Template: ComponentStory<typeof ResourceRoom> = ResourceRoom

export const Default = Template.bind({})

export const Empty = Template.bind({})
Empty.parameters = {
  msw: {
    handlers: {
      resourceRoomData: buildResourceRoomData([]),
      resourceRoomName: buildResourceRoomName({ resourceRoomName: "" }),
    },
  },
}

export const EmptyResourceCategory = Template.bind({})
EmptyResourceCategory.parameters = {
  msw: {
    handlers: {
      resourceRoomData: buildResourceRoomData([]),
      resourceRoomName: buildResourceRoomName({
        resourceRoomName: MOCK_RESOURCE_ROOM_NAME,
      }),
    },
  },
}

export const Loading = Template.bind({})
Loading.parameters = {
  msw: {
    handlers: {
      resourceRoomName: buildResourceRoomName(
        { resourceRoomName: "" },
        "infinite"
      ),
      resourceRoomData: buildResourceRoomData([], "infinite"),
    },
  },
}

export default ResourceRoomMeta
