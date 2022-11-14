import { ComponentStory, ComponentMeta } from "@storybook/react"

import { MOCK_COMMENTS_DATA } from "mocks/constants"
import { handlers } from "mocks/handlers"
import { buildCommentsData, buildMarkCommentsAsReadData } from "mocks/utils"

import { CommentsDrawer } from "./CommentsDrawer"

const CommentsDrawerMeta = {
  title: "Components/CommentsDrawer",
  component: CommentsDrawer,
  parameters: {
    chromatic: {
      delay: 500,
    },
  },
} as ComponentMeta<typeof CommentsDrawer>

const Template: ComponentStory<typeof CommentsDrawer> = () => {
  return <CommentsDrawer siteName="siteName" requestId={1} />
}

export const Default = Template.bind({})
Default.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildCommentsData(MOCK_COMMENTS_DATA),
      buildMarkCommentsAsReadData([]),
    ],
  },
}

export const Loading = Template.bind({})
Loading.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildCommentsData([], "infinite"),
      buildMarkCommentsAsReadData([]),
    ],
  },
}

export const NoComments = Template.bind({})
NoComments.parameters = {
  msw: {
    handlers: [
      ...handlers,
      buildCommentsData([]),
      buildMarkCommentsAsReadData([]),
    ],
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
      buildMarkCommentsAsReadData([]),
      ...handlers,
    ],
  },
}

export default CommentsDrawerMeta
