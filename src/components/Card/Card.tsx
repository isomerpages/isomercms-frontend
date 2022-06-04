/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  BoxProps,
  useMultiStyleConfig,
  chakra,
  HStack,
  Text,
  isStyleProp,
  StackProps,
} from "@chakra-ui/react"
import { objectFilter } from "@chakra-ui/utils"
import { ButtonProps } from "@opengovsg/design-system-react"
import React from "react"

import { CardVariant, CARD_THEME_KEY } from "theme/components/Card"

interface CardProps
  extends Omit<ButtonProps, "leftIcon" | "rightIcon" | "variant"> {
  icon?: JSX.Element
  actionButton?: JSX.Element
  // eslint-disable-next-line react/require-default-props
  variant?: CardVariant
}

export const Card = (props: BoxProps): JSX.Element => {
  const styles = useMultiStyleConfig(CARD_THEME_KEY, props)
  return <Box position="relative" __css={styles.container} {...props} />
}

export const CardContent = ({
  icon,
  children,
  actionButton,
  ...props
}: CardProps): JSX.Element => {
  const styleProps = objectFilter(props, (_, prop) => isStyleProp(prop))
  const remainingProps = objectFilter(props, (_, prop) => !isStyleProp(prop))

  const styles = useMultiStyleConfig(CARD_THEME_KEY, props)
  const { variant } = props
  const shouldWrap =
    React.Children.count(children) === 1 && typeof children === "string"
  const wrappedChildren = shouldWrap ? (
    <Text textStyle="body-1">{children}</Text>
  ) : (
    children
  )

  return <Box position="relative">{children}</Box>
}

export const CardBody = (props: StackProps) => {
  const styles = useMultiStyleConfig(CARD_THEME_KEY, props)

  return (
    <chakra.button __css={styles.content}>
      <HStack
        justifyContent="flex-start"
        display="flex"
        alignItems="flex-start"
        textAlign="left"
        spacing="1rem"
        {...props}
        gridArea="body"
      />
      <Box gridArea="button" />
    </chakra.button>
  )
}

export const CardFooter = (props: BoxProps) => ({})

// if variant is single, jsut reserve space for icon

// if variant is multi, ask consumers to have 2 wraps
// 1. cardbody
// 2. cardfooter
