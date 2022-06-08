/* eslint-disable react/jsx-props-no-spreading */
import { VStack, StackProps } from "@chakra-ui/react"

// eslint-disable-next-line import/prefer-default-export
export const Section = ({ ...props }: StackProps): JSX.Element => {
  return (
    <>
      <VStack {...props} spacing="2rem" align="flex-start" w="100%" />
    </>
  )
}
