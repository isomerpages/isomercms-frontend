import { Box, Divider, HStack, Icon, Text } from "@chakra-ui/react"
import { Checkbox } from "@opengovsg/design-system-react"
import { BiChevronRight, BiEditAlt, BiFolder, BiTrash } from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

import { Card, CardBody } from "components/Card"
import { ContextMenu } from "components/ContextMenu"

import useRedirectHook from "hooks/useRedirectHook"

import { BxFileArchiveSolid } from "assets"

interface FilePreviewCardProps {
  name: string
  isSelected: boolean
  isMenuNeeded?: boolean
  onOpen?: () => void
  onClick?: () => void
  onCheck?: () => void
  onDelete?: () => void
  onMove?: () => void
}

export const FilePreviewCard = ({
  name,
  isSelected,
  isMenuNeeded = true,
  onOpen,
  onClick,
  onCheck,
  onDelete,
  onMove,
}: FilePreviewCardProps): JSX.Element => {
  const { url } = useRouteMatch()
  const { setRedirectToPage } = useRedirectHook()
  const encodedName = encodeURIComponent(name)

  return (
    <Box position="relative" h="100%" data-group>
      {/* Checkbox overlay */}
      <Checkbox
        position="absolute"
        left="1rem"
        top="0.5rem"
        h="3.25rem"
        w="3.25rem"
        size="md"
        p="1rem"
        variant="transparent"
        display={isSelected ? "inline-block" : "none"}
        _groupHover={{
          bg: "transparent",
          display: "inline-block",
        }}
        _focusWithin={{
          outline: "none",
        }}
        zIndex={1}
        isChecked={isSelected}
        onChange={() => {
          if (onCheck) onCheck()
        }}
      />

      <Box
        position="relative"
        h="100%"
        onClick={(e) => {
          // For some weird reason, the onClick event is treated as a submit event
          // We can safely disable the default behaviour here since we define the
          // onClick behaviour ourselves
          e.preventDefault()

          if (onClick) {
            onClick()
          } else {
            setRedirectToPage(`${url}/editMediaSettings/${encodedName}`)
          }
        }}
      >
        <Card variant="multi" _hover={{ bg: undefined }}>
          <CardBody>
            {!isSelected && (
              <Icon
                as={BxFileArchiveSolid}
                fontSize="1.5rem"
                fill="icon.alt"
                _groupHover={{
                  display: "none",
                }}
              />
            )}
            <Text
              textStyle="body-1"
              color="text.label"
              noOfLines={3}
              ml={isSelected ? "2.5rem" : 0}
              _groupHover={{ marginLeft: "2.5rem" }}
            >
              {name}
            </Text>
          </CardBody>
        </Card>
      </Box>

      {isMenuNeeded && (
        <ContextMenu onOpen={onOpen}>
          <ContextMenu.Button />
          <ContextMenu.List>
            <ContextMenu.Item
              icon={<BiEditAlt />}
              as={RouterLink}
              to={`${url}/editMediaSettings/${encodedName}`}
            >
              <Text>Edit details</Text>
            </ContextMenu.Item>
            <ContextMenu.Item icon={<BiFolder />} onClick={onMove}>
              <HStack spacing="4rem" alignItems="center">
                <Text>Move to</Text>
                <Icon as={BiChevronRight} fontSize="1.25rem" />
              </HStack>
            </ContextMenu.Item>
            <>
              <Divider />
              <ContextMenu.Item
                icon={<BiTrash />}
                color="interaction.critical.default"
                onClick={onDelete}
              >
                Delete file
              </ContextMenu.Item>
            </>
          </ContextMenu.List>
        </ContextMenu>
      )}
    </Box>
  )
}
