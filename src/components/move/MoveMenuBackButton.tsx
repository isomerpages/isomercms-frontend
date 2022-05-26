import { Box, useToken, Text, IconButton, HStack, Icon } from "@chakra-ui/react"
import { MouseEventHandler } from "react"

import { BxArrowBack } from "assets/icons"
import { deslugifyDirectory } from "utils"

interface MoveMenuBackButtonProps {
  isDisabled: boolean
  backButtonText: string
  onBack: MouseEventHandler<HTMLButtonElement>
}

// eslint-disable-next-line import/prefer-default-export
export const MoveMenuBackButton = ({
  onBack,
  isDisabled,
  backButtonText,
}: MoveMenuBackButtonProps): JSX.Element => {
  const backgroundColour = useToken("colors", "primary.500")
  return (
    <Box
      bg={backgroundColour}
      borderRadius={0}
      top={0}
      position="sticky"
      py="0.3rem"
      paddingStart={isDisabled ? "3rem" : "1.5rem"}
      w="100%"
      textColor="white"
      zIndex="banner"
    >
      <HStack spacing="1rem" shouldWrapChildren={false}>
        {!isDisabled && (
          // Using chakra iconButton rather than design system to have small size
          <IconButton
            id="moveModal-backButton"
            onClick={onBack}
            aria-label="back-button"
            size="sm"
            icon={<Icon as={BxArrowBack} w="24px" h="24px" />}
          />
        )}
        {/* NOTE: index.scss sets p to have margin bottom of 5 */}
        <Text mb={0} fontSize="md">
          {deslugifyDirectory(backButtonText)}
        </Text>
      </HStack>
    </Box>
  )
}
