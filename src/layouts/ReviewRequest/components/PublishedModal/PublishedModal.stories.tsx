import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { ComponentMeta, Story } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { PublishedModal } from "./PublishedModal"

const modalMeta = {
  title: "Components/ReviewRequest/Published Modal",
  component: PublishedModal,
  decorators: [
    (StoryFn) => {
      return (
        <MemoryRouter initialEntries={["/sites/storybook/workspace"]}>
          <Route path="/sites/:siteName/workspace">
            <StoryFn />
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as ComponentMeta<typeof PublishedModal>

const Template: Story<never> = () => {
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
