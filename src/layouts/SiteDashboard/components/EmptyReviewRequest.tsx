import { VStack, Icon, Text, useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { DisplayCard, DisplayCardContent } from "components/DisplayCard"
import { BiCheckCircle } from "react-icons/bi"

import { ReviewRequestModal } from "layouts/ReviewRequest"

import { EmptyWhiteBoxImage } from "assets"

export const EmptyReviewRequest = (): JSX.Element => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  return (
    <>
      <DisplayCard variant="content" w="100%">
        <DisplayCardContent justifyContent="center" alignItems="center">
          <VStack spacing="1rem" py="2.15rem">
            <EmptyWhiteBoxImage />
            <Text textStyle="caption-2" color="text.helper">
              There are no pending reviews.
            </Text>
            <Button
              leftIcon={<Icon as={BiCheckCircle} fontSize="1.25rem" />}
              onClick={onOpen}
            >
              Request a Review
            </Button>
          </VStack>
        </DisplayCardContent>
      </DisplayCard>
      <ReviewRequestModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
