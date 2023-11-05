import { Box, Button, Flex, HStack, Icon, Spacer, Text } from "@chakra-ui/react"
import { MouseEventHandler } from "react"
import { BiChevronRight, BiFileBlank, BiFolder } from "react-icons/bi"

import { deslugifyDirectory, pageFileNameToTitle } from "utils"

export interface FileMenuItemProps {
  name: string
  id: string | number
  isResource?: boolean
}

export const FileMenuItem = ({
  name,
  id,
  isResource = false,
}: FileMenuItemProps): JSX.Element => {
  return (
    <Box
      w="100%"
      data-cy={id}
      color="grey.200"
      pl="1rem"
      pr="1.25rem"
      py="0.75rem"
    >
      <HStack spacing="1rem">
        <Icon as={BiFileBlank} fontSize="1.25rem" />
        <Text textStyle="body-1">{pageFileNameToTitle(name, isResource)}</Text>
      </HStack>
    </Box>
  )
}

export interface DirMenuItemProps {
  name: string
  id: string | number
  onClick: MouseEventHandler<HTMLButtonElement>
}

export const DirMenuItem = ({
  name,
  id,
  onClick,
}: DirMenuItemProps): JSX.Element => {
  return (
    <Button
      w="100%"
      variant="clear"
      colorScheme="slate"
      color="base.content.strong"
      borderWidth={0}
      pl="1rem"
      pr="1.25rem"
      py="1.5rem"
      display="flex"
      data-cy={id}
      id={`moveModal-forwardButton-${name}`}
      onClick={onClick}
      leftIcon={<Icon as={BiFolder} fontSize="1.25rem" mr="0.5rem" />}
      justifyContent="flex-start"
      _focus={{
        boxShadow: 0,
      }}
    >
      <Flex w="100%">
        <Text
          justifySelf="flex-start"
          as="span"
          textStyle="subhead-1"
          textAlign="left"
          noOfLines={1}
        >
          {deslugifyDirectory(name)}
        </Text>
        <Spacer />
        <Icon
          id={`moveModal-forwardButton-${name}`}
          fontSize="1.25rem"
          as={BiChevronRight}
        />
      </Flex>
    </Button>
  )
}
