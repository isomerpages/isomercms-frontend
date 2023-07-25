import {
  Button as ChakraButton,
  useMultiStyleConfig,
  chakra,
} from "@chakra-ui/react"

export interface RatingProps {
  onClick: (idx: number) => void
  activeIdx: number
}

export const Rating = ({ onClick, activeIdx }: RatingProps) => {
  const styles = useMultiStyleConfig("Rating")
  const paginationStyles = useMultiStyleConfig("Pagination")

  return (
    <chakra.ul __css={styles.container}>
      {Array(11)
        .fill(null)
        .map((_, idx) => {
          return (
            <chakra.li>
              <ChakraButton
                variant="unstyled"
                sx={{
                  // NOTE: We need to use the pagination styles
                  // because the figma uses the pagination button for rating...
                  ...paginationStyles.button,
                  ...styles.button,
                }}
                onClick={() => onClick(idx)}
                isActive={activeIdx === idx}
              >
                {idx}
              </ChakraButton>
            </chakra.li>
          )
        })}
    </chakra.ul>
  )
}
