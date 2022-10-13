import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalProps,
  Text,
  Box,
  VStack,
} from "@chakra-ui/react"
import { Button, ModalCloseButton } from "@opengovsg/design-system-react"

import { ToastImage } from "assets"

interface ApprovedModalProps extends Omit<ModalProps, "children"> {
  onClick: () => void
  isLoading?: boolean
}

export const ApprovedModal = ({
  isLoading,
  onClick,
  ...props
}: ApprovedModalProps): JSX.Element => {
  const { onClose } = props

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="primary.100" p={0}>
          <Box pt="4.5rem">
            <ToastImage />
          </Box>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack
            spacing="0.625rem"
            align="flex-start"
            px="1rem"
            pt="2.5rem"
            pb="0.5rem"
          >
            <Text textStyle="h4">This Review request has been approved!</Text>
            <Text textStyle="body-1" textColor="text.body">
              Your changes are ready for your live site. You can publish them
              right away, or at a later time from your site’s dashboard.
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="clear"
            mr="1rem"
            onClick={onClose}
            colorScheme="secondary"
            textColor="text.title.brandSecondary"
          >
            Publish later
          </Button>
          <Button isLoading={isLoading} onClick={onClick}>
            Publish now
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
