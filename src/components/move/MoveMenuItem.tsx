import { Spacer, Box, Flex, Text, Button } from "@chakra-ui/react"
import { MouseEventHandler } from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { pageFileNameToTitle, deslugifyDirectory } from "utils"

interface FileMenuItemProps {
  name: string
  id: string
  isResource: boolean
}

const FileMenuItem = ({ name, id, isResource = false }: FileMenuItemProps) => {
  return (
    <div
      id={id}
      data-cy={id}
      className={`
        ${elementStyles.dropdownItemDisabled}
      `}
    >
      <i
        className={`${elementStyles.dropdownIcon} ${elementStyles.disabledIcon} bx bx-sm bx-file-blank`}
      />
      {pageFileNameToTitle(name, isResource)}
    </div>
  )
}

interface DirMenuItemProps {
  name: string
  id: string
  onForward: MouseEventHandler<HTMLButtonElement>
}

const DirMenuItem = ({ name, id, onForward }: DirMenuItemProps) => {
  return (
    <>
      <Button
        isFullWidth
        variant="clear"
        paddingStart="1.5rem"
        display="flex"
        data-cy={id}
        id={`moveModal-forwardButton-${name}`}
        onClick={onForward}
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

interface Item {
  name: string
  type: "file" | "dir"
}

interface MoveMenuItemProps {
  item: Item
  id: string
  onForward: DirMenuItemProps["onForward"]
  isResource: FileMenuItemProps["isResource"]
}

// eslint-disable-next-line import/prefer-default-export
export const MoveMenuItem = ({
  item,
  id,
  onForward,
  isResource = false,
}: MoveMenuItemProps): JSX.Element => {
  const { name, type } = item
  if (type === "file")
    return <FileMenuItem name={name} id={id} isResource={isResource} />
  return <DirMenuItem name={name} id={id} onForward={onForward} />
}
