import { Spacer, Box, Flex, Text, Button } from "@chakra-ui/react"
import { MouseEventHandler } from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { pageFileNameToTitle, deslugifyDirectory } from "utils"

interface FileMenuItemProps {
  name: string
  id: string
  isResource: boolean
}

export const FileMenuItem = ({
  name,
  id,
  isResource = false,
}: FileMenuItemProps): JSX.Element => {
  return (
    <div
      id={id}
      data-cy={id}
      className={`
        ${elementStyles.dropdownItemDisabled}
      `}
    >
      <Box pr="1.5rem" className="bx bx-sm bx-file-blank" />
      {pageFileNameToTitle(name, isResource)}
    </div>
  )
}

interface DirMenuItemProps {
  name: string
  id: string
  onClick: MouseEventHandler<HTMLButtonElement>
}

export const DirMenuItem = ({
  name,
  id,
  onClick,
}: DirMenuItemProps): JSX.Element => {
  return (
    <>
      <Button
        isFullWidth
        variant="clear"
        paddingStart="1.5rem"
        display="flex"
        data-cy={id}
        id={`moveModal-forwardButton-${name}`}
        onClick={onClick}
        leftIcon={<Box pr="1rem" className="bx bx-sm bx-folder" />}
        justifyContent="flex-start"
        _focus={{
          boxShadow: 0,
        }}
      >
        <Flex w="100%">
          <Text
            justifySelf="flex-start"
            as="span"
            textStyle="body-1"
            color="gray.800"
          >
            {deslugifyDirectory(name)}
          </Text>
          <Spacer />
          <Box
            id={`moveModal-forwardButton-${name}`}
            className="bx bx-sm bx-chevron-right"
          />
        </Flex>
      </Button>
    </>
  )
}
