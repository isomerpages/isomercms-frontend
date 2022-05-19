import { Spacer, Flex, Text, Button, Icon } from "@chakra-ui/react"
import { MouseEventHandler } from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { BxFileBlank, BxFolder, BxChevronRight } from "assets/icons"
import { pageFileNameToTitle, deslugifyDirectory } from "utils"

export interface FileMenuItemProps {
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
      <Icon w="24px" h="24px" as={BxFileBlank} mr="1.5rem" />
      {pageFileNameToTitle(name, isResource)}
    </div>
  )
}

export interface DirMenuItemProps {
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
        leftIcon={<Icon as={BxFolder} w="24px" h="24px" mr="1rem" />}
        justifyContent="flex-start"
        _focus={{
          boxShadow: 0,
        }}
        borderRadius={0}
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
          <Icon
            id={`moveModal-forwardButton-${name}`}
            w="24px"
            h="24px"
            as={BxChevronRight}
          />
        </Flex>
      </Button>
    </>
  )
}
