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
import { Button, ModalCloseButton, Link } from "@opengovsg/design-system-react"
import { useQueryClient } from "react-query"
import { useParams } from "react-router-dom"

import { invalidateMergeRelatedQueries } from "hooks/reviewHooks"
import { useGetSiteUrl } from "hooks/settingsHooks"

import { RocketBlastOffImage } from "assets"

export const PublishedModal = (
  props: Omit<ModalProps, "children">
): JSX.Element => {
  const { onClose } = props
  const queryClient = useQueryClient()
  const { siteName, reviewId: prNumber } = useParams<{
    siteName: string
    reviewId: string
  }>()
  const { data: siteUrl, isLoading } = useGetSiteUrl(siteName)

  return (
    <Modal
      {...props}
      onCloseComplete={() => {
        invalidateMergeRelatedQueries(
          queryClient,
          siteName,
          // TODO!: redirect if invalid
          parseInt(prNumber, 10)
        )
      }}
    >
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
            variant="link"
            mr="1rem"
            colorScheme="primary"
            textColor="text.title.brandSecondary"
            as={Link}
            href={`https://${siteUrl}`}
            isLoading={isLoading}
          >
            Go to live site
          </Button>
          <Button onClick={onClose}>Back to Site Dashboard</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
