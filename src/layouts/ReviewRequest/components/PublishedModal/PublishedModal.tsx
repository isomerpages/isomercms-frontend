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

import { RocketBlastOffImage } from "assets"

export const PublishedModal = (props: ModalProps): JSX.Element => {
  const { onClose } = props

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="secondary.100" p={0}>
          <Box pt="4.5rem">
            <RocketBlastOffImage />
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
            <Text textStyle="h4">Your changes have been published!</Text>
            <Text textStyle="body-1" textColor="text.body">
              They may take a few minutes to appear on your live site. Try
              refreshing your page in a few minutes.
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="clear"
            mr="1rem"
            onClick={onClose}
            colorScheme="primary"
            textColor="text.title.brandSecondary"
          >
            Go to live site
          </Button>
          <Button>Back to Site Dashboard</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
