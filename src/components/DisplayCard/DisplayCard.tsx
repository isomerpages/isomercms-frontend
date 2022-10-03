/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Divider,
  HStack,
  StylesProvider,
  Text,
  useMultiStyleConfig,
  useStyles,
  VStack,
} from "@chakra-ui/react"
import type { BoxProps, StackProps, TextProps } from "@chakra-ui/react"

import {
  DisplayCardVariant,
  DISPLAY_CARD_THEME_KEY,
} from "theme/components/DisplayCard"

interface DisplayCardProps extends StackProps {
  variant?: DisplayCardVariant
}

interface DisplayCardHeaderProps extends BoxProps {
  button?: JSX.Element
}

interface DisplayCardTitleProps extends TextProps {
  icon?: JSX.Element
  hasDivider?: boolean
}

export const DisplayCard = ({
  bgColor = "background.action.defaultInverse",
  children,
  ...props
}: DisplayCardProps): JSX.Element => {
  const styles = useMultiStyleConfig(DISPLAY_CARD_THEME_KEY, props)

  return (
    <StylesProvider value={styles}>
      <VStack
        position="relative"
        h="100%"
        spacing="1rem"
        bgColor={bgColor}
        {...(styles.container as StackProps)}
      >
        {children}
      </VStack>
    </StylesProvider>
  )
}

export const DisplayCardHeader = ({
  button,
  children,
  ...props
}: DisplayCardHeaderProps): JSX.Element => {
  const styles = useStyles()

  return (
    <Box __css={styles.header} {...props}>
      <Box w="100%">{children}</Box>
      {button}
    </Box>
  )
}

export const DisplayCardTitle = ({
  children,
  icon,
  hasDivider,
  ...props
}: DisplayCardTitleProps): JSX.Element => {
  const styles = useStyles()

  return (
    <>
      <HStack paddingBottom="0.25rem">
        <Text {...(styles.title as TextProps)} {...props}>
          {children}
        </Text>
        {icon}
      </HStack>
      {hasDivider && <Divider my="0.75rem" />}
    </>
  )
}

export const DisplayCardCaption = ({
  children,
  ...props
}: TextProps): JSX.Element => {
  const styles = useStyles()

  return (
    <Text {...(styles.caption as TextProps)} {...props}>
      {children}
    </Text>
  )
}

export const DisplayCardContent = ({
  children,
  ...props
}: BoxProps): JSX.Element => {
  const styles = useStyles()

  return (
    <Box __css={styles.content} {...props}>
      {children}
    </Box>
  )
}

export const DisplayCardFooter = ({
  children,
  ...props
}: BoxProps): JSX.Element => {
  const styles = useStyles()

  return (
    <Box __css={styles.footer} {...props}>
      {children}
    </Box>
  )
}
