import { ComponentStory, ComponentMeta } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import {
  MOCK_DIR_DATA,
  MOCK_FOLDER_NAME,
  MOCK_PAGES_DATA,
} from "mocks/constants"
import { buildFolderData } from "mocks/utils"

import { handlers } from "../../mocks/handlers"

import { Folders } from "./Folders"

const FoldersMeta = {
  title: "Pages/Folders",
  component: Folders,
  parameters: {
    // Set delay so mock API requests will get resolved and the UI will render properly
    chromatic: { delay: 300 },
    msw: {
      handlers,
    },
  },
  decorators: [
    (Story) => {
      return (
        <MemoryRouter
          initialEntries={[`/sites/storybook/folders/${MOCK_FOLDER_NAME}`]}
        >
          <Route path="/sites/:siteName/folders/:collectionName">
            <Story />
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as ComponentMeta<typeof Folders>

const Template: ComponentStory<typeof Folders> = Folders

export const Default = Template.bind({})
Default.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildFolderData([...MOCK_DIR_DATA, ...MOCK_PAGES_DATA]),
    ],
  },
}

export const Empty = Template.bind({})
Empty.parameters = {
  msw: {
    handlers: [...handlers, buildFolderData([])],
  },
}

export const Loading = Template.bind({})
Loading.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildFolderData([...MOCK_DIR_DATA, ...MOCK_PAGES_DATA], "infinite"),
    ],
  },
}

export default FoldersMeta
