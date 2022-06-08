/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  BoxProps,
  useMultiStyleConfig,
  Grid,
  GridProps,
  GridItem,
} from "@chakra-ui/react"
import { PropsWithChildren } from "react"

import { CardVariant, CARD_THEME_KEY } from "theme/components/Card"

export const Card = (props: BoxProps): JSX.Element => {
  const styles = useMultiStyleConfig(CARD_THEME_KEY, props)
  return <Box position="relative" __css={styles.container} {...props} />
}

interface CardLayoutProps extends GridProps {
  variant: CardVariant
  // Indicates whether the card is singleline or multiline
  isMultiline?: boolean
}
export const CardLayout = ({
  variant,
  isMultiline = false,
  ...rest
}: CardLayoutProps): JSX.Element => {
  const {
    gridTemplateRows,
    gridTemplateColumns,
    gridTemplateAreas,
  } = getCardLayout(variant, isMultiline)

  return (
    <Grid
      {...rest}
      gridTemplateRows={gridTemplateRows}
      gridTemplateColumns={gridTemplateColumns}
      gridTemplateAreas={gridTemplateAreas}
    />
  )
}

Card.Layout = CardLayout
type GridTemplateLayout = Pick<
  GridProps,
  "gridTemplateRows" | "gridTemplateColumns" | "gridTemplateAreas"
>

// NOTE: Can't put this into theme as it requires a isMultiline prop
// Chakra only allows theme functions to take a limited subset of props
const getCardLayout = (
  variant: CardLayoutProps["variant"],
  isMultiline: boolean
): GridTemplateLayout =>
  isMultiline ? getMultiCardLayout(variant) : getSingleCardLayout(variant)

const getSingleCardLayout = (
  variant: CardLayoutProps["variant"]
): GridTemplateLayout => {
  // NOTE: This means the rows can reflow from a minimum of 2.5rem up till auto (determined by CSS)
  // This is so that we can reserve a 2.5rem by 2.5rem square for any potential buttons/icons
  const gridTemplateRows = "minmax(2.5rem, auto)"
  switch (variant) {
    case "full": {
      return {
        // Defines a 1 row x 3 col grid with the specified layout
        gridTemplateAreas: `"leftItem body rightItem"`,
        gridTemplateRows,
        gridTemplateColumns: "2.5rem 1fr 2.5rem",
      }
    }
    case "left": {
      return {
        gridTemplateAreas: `"leftItem body"`,
        gridTemplateRows,
        gridTemplateColumns: "2.5rem 1fr",
      }
    }
    case "right": {
      return {
        gridTemplateAreas: `"body rightItem"`,
        gridTemplateRows,
        gridTemplateColumns: "1fr 2.5rem",
      }
    }
    default: {
      const exception: never = variant
      throw new Error(`Exception: CardLayout has unknown variant: ${exception}`)
    }
  }
}

const getMultiCardLayout = (
  variant: CardLayoutProps["variant"]
): GridTemplateLayout => {
  // Top row is free to expand up till 2.5 rem reserved for footer
  const gridTemplateRows = "1fr 2.5rem"
  switch (variant) {
    case "full": {
      return {
        // Defines a 2 row x 3 col grid, with 2.5 rem on top-left/bottom-right for buttons
        gridTemplateAreas: `"leftItem body body"
                            "leftItem footer rightItem"`,
        gridTemplateRows,
        gridTemplateColumns: "2.5rem 1fr 2.5rem",
      }
    }
    case "left": {
      return {
        // Defines a 2 row x 2 col grid, with 2.5 rem on top-left for button
        gridTemplateAreas: `"leftItem body"
                            "leftItem footer"`,
        gridTemplateRows,
        gridTemplateColumns: "2.5rem 1fr",
      }
    }
    case "right": {
      return {
        // Defines a 2 row x 2 col grid, with 2.5 rem on bottom-rgiht for button
        gridTemplateAreas: `"body body"
                            "footer rightItem"`,
        gridTemplateRows,
        gridTemplateColumns: "1fr 2.5rem",
      }
    }
    default: {
      const exception: never = variant
      throw new Error(`Exception: CardLayout has unknown variant: ${exception}`)
    }
  }
}

interface CardItemProps {
  position: "leftItem" | "rightItem" | "footer" | "body"
}

// NOTE: Not exposing grid props on purpose as it will affect grid layout
const CardItem = ({
  position,
  children,
}: PropsWithChildren<CardItemProps>): JSX.Element => {
  return <GridItem gridArea={position}>{children}</GridItem>
}

Card.Item = CardItem

const CardBody = (props: BoxProps): JSX.Element => {
  const styles = useMultiStyleConfig(CARD_THEME_KEY, props)
  return (
    <Card.Item position="body">
      <Box {...props} __css={styles.body} />
    </Card.Item>
  )
}

Card.Body = CardBody
