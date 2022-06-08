import { chakra, useMultiStyleConfig } from "@chakra-ui/react"
import { ButtonProps } from "@opengovsg/design-system-react"

import { CARD_THEME_KEY } from "theme/components/Card"

export const CardButton = (props: ButtonProps): JSX.Element => {
  const styles = useMultiStyleConfig(CARD_THEME_KEY, props)

  return (
    <chakra.button
      display="block"
      position="relative"
      w="100%"
      textAlign="left"
      __css={styles.container}
      sx={{
        _hover: {
          backgroundColor: "background.action.altInverse",
        },
        _focus: {
          boxShadow: `0 0 0 2px var(--chakra-colors-border-action-default)`,
        },
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    />
  )
}
