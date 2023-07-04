import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { Meta, StoryFn } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { PublishedModal } from "./PublishedModal"

const modalMeta = {
  title: "Components/ReviewRequest/Published Modal",
  component: PublishedModal,
  decorators: [
    (Story) => {
      return (
        <MemoryRouter initialEntries={["/sites/storybook/workspace"]}>
          <Route path="/sites/:siteName/workspace">
            <Story />
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as Meta<typeof PublishedModal>

const Template: StoryFn<Record<string, never>> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <PublishedModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export const Playground = Template.bind({})

export default modalMeta
