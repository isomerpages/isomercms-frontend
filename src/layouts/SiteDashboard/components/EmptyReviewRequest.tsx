import { VStack, Icon, Text } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { DisplayCard, DisplayCardContent } from "components/DisplayCard"
import { BiCheckCircle } from "react-icons/bi"

import { EmptyBoxPlainImage } from "assets"

export const EmptyReviewRequest = (): JSX.Element => {
  return (
    <DisplayCard variant="onlyContent" w="100%">
      <DisplayCardContent justifyContent="center" alignItems="center">
        <VStack spacing="1rem" py="2.15rem">
          <EmptyBoxPlainImage />
          <Text textStyle="caption-2" color="text.helper">
            There are no pending reviews.
          </Text>
          {/* TODO: To be replaced by review request modal */}
          <Button leftIcon={<Icon as={BiCheckCircle} fontSize="1.25rem" />}>
            Request a Review
          </Button>
        </VStack>
      </DisplayCardContent>
    </DisplayCard>
  )
}
