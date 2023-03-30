import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { ComponentMeta, Story } from "@storybook/react"
import { MemoryRouter, Route } from "react-router-dom"

import { CancelRequestModal } from "./CancelRequestModal"

const modalMeta = {
  title: "Components/ReviewRequest/Cancel Request Modal",
  component: CancelRequestModal,
  decorators: [
    (StoryFn) => {
      return (
        <MemoryRouter initialEntries={["/sites/storybook/review/1"]}>
          <Route path="/sites/:siteName/review/:reviewId">
            <StoryFn />
          </Route>
        </MemoryRouter>
      )
    },
  ],
} as ComponentMeta<typeof CancelRequestModal>

const Template: Story<never> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>
      <CancelRequestModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export const Playground = Template.bind({})

export default modalMeta
