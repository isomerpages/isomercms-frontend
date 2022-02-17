import { Box, Flex } from "@chakra-ui/react"

export interface BannerProps {
  children: string
}

// TODO: Please get rid of this and use the design system instead!!
const styles = {
  banner: { color: "white", bg: "#2B5FCE" },
  item: {
    display: "flex",
    justifyContent: "space-between",
    px: "1rem",
    py: ["1rem", "1rem", "0.5rem"],
  },
}

export const Banner = ({ children }: BannerProps): JSX.Element => {
  return (
    <Box __css={styles.banner}>
      <Flex sx={styles.item}>
        <Flex>{children}</Flex>
      </Flex>
    </Box>
  )
}
