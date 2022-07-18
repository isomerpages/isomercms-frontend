import { ComponentStory, ComponentMeta } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import {
  MOCK_DIR_DATA,
  MOCK_FOLDER_NAME,
  MOCK_PAGES_DATA,
  MOCK_SUBFOLDER_NAME,
} from "mocks/constants"
import { buildSubfolderData } from "mocks/utils"

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
          initialEntries={[
            `/sites/storybook/folders/${MOCK_FOLDER_NAME}/subfolders/${MOCK_SUBFOLDER_NAME}`,
          ]}
        >
          <Route path="/sites/:siteName/folders/:collectionName/subfolders/:subCollectionName">
            <Story />
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as ComponentMeta<typeof Folders>

const Template: ComponentStory<typeof Folders> = Folders

export const Subfolder = Template.bind({})
Subfolder.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildSubfolderData([...MOCK_DIR_DATA, ...MOCK_PAGES_DATA]),
    ],
  },
}

export default FoldersMeta
