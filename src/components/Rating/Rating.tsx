import {
  Button as ChakraButton,
  useMultiStyleConfig,
  chakra,
  Text,
  Flex,
  Box,
  Spacer,
} from "@chakra-ui/react"
import { PropsWithChildren } from "react"

const RATING_SCALE = 11

interface RatingButtonProps {
  onClick: () => void
  isActive: boolean
}
const RatingButton = ({
  onClick,
  isActive,
  children,
}: PropsWithChildren<RatingButtonProps>) => {
  const styles = useMultiStyleConfig("Rating")
  const paginationStyles = useMultiStyleConfig("Pagination")

  return (
    <>
      <ChakraButton
        variant="unstyled"
        sx={{
          // NOTE: We need to use the pagination styles
          // because the figma uses the pagination button for rating...
          ...paginationStyles.button,
          ...styles.button,
        }}
        onClick={onClick}
        isActive={isActive}
      >
        {children}
      </ChakraButton>
    </>
  )
}

export interface RatingProps {
  onClick: (idx: number) => void
  activeIdx: number
}

export const Rating = ({ onClick, activeIdx }: RatingProps) => {
  const styles = useMultiStyleConfig("Rating")

  return (
    <Box>
      <chakra.ul __css={styles.container}>
        {Array(RATING_SCALE)
          .fill(null)
          .map((_, idx) => {
            return (
              <chakra.li>
                <RatingButton
                  onClick={() => onClick(idx)}
                  isActive={activeIdx === idx}
                >
                  {idx}
                </RatingButton>
              </chakra.li>
            )
          })}
      </chakra.ul>
      <Flex w="full">
        <Text textStyle="caption-1">Not satisfied</Text>
        <Spacer />
        <Text textStyle="caption-1">Very satisfied</Text>
      </Flex>
    </Box>
  )
}
