/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  BoxProps,
  useMultiStyleConfig,
  chakra,
  HStack,
  StackProps,
  StylesProvider,
  useStyles,
  omitThemingProps,
} from "@chakra-ui/react"
import { ButtonProps } from "@opengovsg/design-system-react"
import { createContext, useContext } from "react"

import { CardVariant, CARD_THEME_KEY } from "theme/components/Card"

interface CardProps
  extends Omit<ButtonProps, "leftIcon" | "rightIcon" | "variant"> {
  // eslint-disable-next-line react/require-default-props
  variant?: CardVariant
}

interface CardContextProps extends ReturnType<typeof omitThemingProps> {
  variant: CardVariant
}

const CardContext = createContext<CardContextProps | undefined>(undefined)

const useCardContext = (): CardContextProps => {
  const context = useContext(CardContext)
  if (!context) {
    throw new Error("useCalendar must be used within a CardProvider")
  }

  return context
}

export const Card = ({ children, ...props }: CardProps): JSX.Element => {
  const variant = props.variant ?? "single"
  const styles = useMultiStyleConfig(CARD_THEME_KEY, props)
  const buttonBehaviourProps = omitThemingProps(props)
  const Inner = () =>
    variant === "multi" ? (
      <chakra.button __css={styles.container} {...props}>
        {children}
      </chakra.button>
    ) : (
      <>{children}</>
    )

  return (
    <CardContext.Provider value={{ variant, ...buttonBehaviourProps }}>
      <StylesProvider value={styles}>
        <Box position="relative" h="100%" overflow="auto">
          <Inner />
        </Box>
      </StylesProvider>
    </CardContext.Provider>
  )
}

export const CardBody = (props: StackProps): JSX.Element => {
  const { variant, ...buttonBehaviourProps } = useCardContext()
  const styles = useStyles()
  const Inner = () => (
    <>
      {/* NOTE: Not using the __css prop here because it doesn't play well with HStack */}
      <HStack {...(styles.body as StackProps)} {...props} spacing="1rem" />
      {variant === "single" && <Box gridArea="button" />}
    </>
  )

  if (variant === "multi") {
    return <Inner />
  }

  return (
    <chakra.button __css={styles.container} {...buttonBehaviourProps}>
      <Inner />
    </chakra.button>
  )
}

export const CardFooter = (props: BoxProps): JSX.Element => {
  const styles = useStyles()
  return (
    <>
      <Box __css={styles.footer} {...props} />
      <Box gridArea="button" />
    </>
  )
}
