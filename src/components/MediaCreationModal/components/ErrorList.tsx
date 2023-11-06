import { Flex, Icon, UnorderedList, ListItem, Text } from "@chakra-ui/react"
import { BiSolidErrorCircle } from "react-icons/bi"

interface ErrorListProps {
  errorMessages?: string[]
}
export const ErrorList = ({ errorMessages }: ErrorListProps) => {
  if (!errorMessages || errorMessages.length === 0) return null

  return (
    <>
      <Flex alignItems="center" my="1rem" color="utility.feedback.critical">
        <Icon
          as={BiSolidErrorCircle}
          fill="utility.feedback.critical"
          mr="0.5rem"
        />
        <Text textColor="utility.feedback.critical">
          {`${errorMessages.length} images failed to upload`}
        </Text>
      </Flex>
      <UnorderedList>
        {errorMessages.map((message) => {
          return (
            <ListItem>
              <Text textColor="utility.feedback.critical">{message}</Text>
            </ListItem>
          )
        })}
      </UnorderedList>
    </>
  )
}
