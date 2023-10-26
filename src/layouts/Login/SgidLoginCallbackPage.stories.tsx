import { ComponentStory, ComponentMeta } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { MOCK_SGID_USER_DATA } from "mocks/constants"
import { buildSgidUserData } from "mocks/utils"

import { handlers } from "../../mocks/handlers"

import { SgidLoginCallbackPage } from "./SgidLoginCallbackPage"

const SgidLoginCallbackPageMeta = {
  title: "Pages/SgidLoginCallbackPage",
  component: SgidLoginCallbackPage,
  parameters: {
    // Set delay so mock API requests will get resolved and the UI will render properly
    chromatic: { delay: 500 },
    msw: {
      handlers,
    },
  },
  decorators: [
    (Story) => {
      return (
        <MemoryRouter initialEntries={["/sgid-callback"]}>
          <Route path="/sgid-callback">
            <Story />
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as ComponentMeta<typeof SgidLoginCallbackPage>

const Template: ComponentStory<
  typeof SgidLoginCallbackPage
> = SgidLoginCallbackPage

export const Default = Template.bind({})
Default.parameters = {
  msw: {
    handlers: [...handlers, buildSgidUserData(MOCK_SGID_USER_DATA)],
  },
}

export const Loading = Template.bind({})
Loading.parameters = {
  msw: {
    handlers: [...handlers, buildSgidUserData(MOCK_SGID_USER_DATA, "infinite")],
  },
}

export default SgidLoginCallbackPageMeta
