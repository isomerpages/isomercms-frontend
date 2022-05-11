import { Spacer, Box, Flex, Text, Button } from "@chakra-ui/react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { pageFileNameToTitle, deslugifyDirectory } from "utils"

const FileMenuItem = ({ name, id, isResource = false }) => {
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

const DirMenuItem = ({ name, id, onForward }) => {
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

// eslint-disable-next-line import/prefer-default-export
export const MoveMenuItem = ({
  item,
  id,
  isItemSelected,
  onItemSelect,
  onForward,
  isResource = false,
}) => {
  const { name, type } = item
  if (type === "file")
    return <FileMenuItem name={name} id={id} isResource={isResource} />
  return (
    <DirMenuItem
      name={name}
      id={id}
      isItemSelected={isItemSelected}
      onItemSelect={onItemSelect}
      onForward={onForward}
    />
  )
}
