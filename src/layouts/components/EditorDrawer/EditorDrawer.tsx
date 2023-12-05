import { Grid, GridItem, HStack, Icon, Spacer } from "@chakra-ui/react"
import { IconButton } from "@opengovsg/design-system-react"
import React, { PropsWithChildren } from "react"
import { BiX } from "react-icons/bi"

import { MiniDrawer } from "../MiniDrawer"

interface EditorDrawerProps {
  isOpen: boolean
}

interface EditorDrawerHeaderProps {
  onClose: () => void
  children: React.ReactNode
}

interface EditorDrawerContentProps {
  children: React.ReactNode
}

interface EditorDrawerFooterProps {
  children: React.ReactNode
}

export const EditorDrawer = ({
  isOpen,
  children,
}: PropsWithChildren<EditorDrawerProps>): JSX.Element => {
  return (
    <MiniDrawer isOpen={isOpen} width="45vw">
      <Grid
        bgColor="base.canvas.default"
        w="100%"
        h="100%"
        gridTemplateRows="3.25rem 1fr 4rem"
        gridTemplateAreas="'header' 'content' 'footer'"
        borderRight="1px solid"
        borderRightColor="base.divider.medium"
      >
        {children}
      </Grid>
    </MiniDrawer>
  )
}

export const EditorDrawerHeader = ({
  onClose,
  children,
}: EditorDrawerHeaderProps): JSX.Element => {
  return (
    <GridItem gridArea="header" pt="1.5rem" pl="1.5rem" pr="0.875rem">
      <HStack h="1.75rem">
        {children}
        <Spacer />
        <IconButton
          variant="clear"
          onClick={onClose}
          aria-label="close editor drawer"
        >
          <Icon as={BiX} fontSize="1.5rem" color="base.content.strong" />
        </IconButton>
      </HStack>
    </GridItem>
  )
}

export const EditorDrawerContent = ({
  children,
}: EditorDrawerContentProps): JSX.Element => {
  return (
    <GridItem gridArea="content" p="1.5rem" overflowY="scroll">
      {children}
    </GridItem>
  )
}

export const EditorDrawerFooter = ({
  children,
}: EditorDrawerFooterProps): JSX.Element => {
  return (
    <GridItem
      gridArea="footer"
      borderTop="1px solid"
      borderTopColor="base.divider.medium"
    >
      <HStack my="0.625rem" px="2rem">
        <Spacer />
        {children}
      </HStack>
    </GridItem>
  )
}

EditorDrawer.Header = EditorDrawerHeader
EditorDrawer.Content = EditorDrawerContent
EditorDrawer.Footer = EditorDrawerFooter
