import { Flex, Box } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"

import { deslugifyDirectory } from "utils"

// eslint-disable-next-line import/prefer-default-export
export const MoveMenuBackButton = ({ onBack, isDisabled, backButtonText }) => {
  return (
    <Button
      id="moveModal-backButton"
      onClick={!isDisabled && onBack}
      borderRadius={0}
      top={0}
      position="sticky"
      // NOTE: Design system button wraps in a box, which means that the Flex component
      // is unable to stretch to fill the width of the button hence this prop is here
      justifyContent="flex-start"
      py="0.3rem"
      paddingStart={isDisabled ? "3rem" : "1.5rem"}
      w="100%"
    >
      <Flex alignItems="center">
        {!isDisabled && (
          <Box pr="1.5rem" className="bx bx-sm bx-arrow-back text-white" />
        )}
        {deslugifyDirectory(backButtonText)}
      </Flex>
    </Button>
  )
}
