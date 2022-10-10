import { ComponentStory, ComponentMeta } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { MOCK_COMMENTS_DATA } from "mocks/constants"
import { handlers } from "mocks/handlers"
import { buildCommentsData } from "mocks/utils"

import { CommentsDrawer } from "./CommentsDrawer"

const CommentsDrawerMeta = {
  title: "Components/CommentsDrawer",
  component: CommentsDrawer,
  parameters: {
    chromatic: {
      delay: 500,
    },
  },
  decorators: [
    (Story) => {
      return (
        <MemoryRouter initialEntries={["/sites/storybook/commentsDrawer"]}>
          <Route path="/sites/:siteName/commentsDrawer">
            <Story />
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as ComponentMeta<typeof CommentsDrawer>

const Template: ComponentStory<typeof CommentsDrawer> = () => {
  return <CommentsDrawer siteName="siteName" requestId={1} />
}

export const Default = Template.bind({})
Default.parameters = {
  msw: {
    handlers: [...handlers, buildCommentsData(MOCK_COMMENTS_DATA)],
  },
}

export const Loading = Template.bind({})
Loading.parameters = {
  msw: {
    handlers: [...handlers, buildCommentsData([], "infinite")],
  },
}

export const NoComments = Template.bind({})
NoComments.parameters = {
  msw: {
    handlers: [...handlers, buildCommentsData([])],
  },
}

export const ManyComments = Template.bind({})
ManyComments.parameters = {
  msw: {
    handlers: [
      buildCommentsData([
        ...MOCK_COMMENTS_DATA,
        ...MOCK_COMMENTS_DATA,
        ...MOCK_COMMENTS_DATA,
      ]),
      ...handlers,
    ],
  },
}

export default CommentsDrawerMeta
