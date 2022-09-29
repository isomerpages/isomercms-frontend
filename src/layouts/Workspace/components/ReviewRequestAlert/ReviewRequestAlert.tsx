import { Alert, AlertIcon, Link } from "@chakra-ui/react"

export interface ReviewRequestAlertProps {
  reviewRequestUrl: string
}

export const ReviewRequestAlert = ({
  reviewRequestUrl,
}: ReviewRequestAlertProps): JSX.Element => {
  return (
    <Alert
      status="warning"
      bg="background.action.warningInverse"
      pl="3rem"
      py="1rem"
      pr="1rem"
    >
      <AlertIcon
        color="icon.warning"
        position="absolute"
        top="1rem"
        left="1rem"
      />
      <p>
        There’s a Review request pending approval. Any changes you make now will
        be added to the existing Review request, and published with the changes
        in it.&nbsp; <Link href="https://www.google.com">View request</Link>
      </p>
    </Alert>
  )
}
