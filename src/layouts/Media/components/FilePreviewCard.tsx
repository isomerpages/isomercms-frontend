import {
  LinkBox,
  LinkOverlay,
  Icon,
  Text,
  Divider,
  HStack,
  Box,
} from "@chakra-ui/react"
import { BiChevronRight, BiEditAlt, BiFolder, BiTrash } from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

import { Card, CardBody } from "components/Card"
import { ContextMenu } from "components/ContextMenu"

import { BxFileArchiveSolid } from "assets"

interface FilePreviewCardProps {
  name: string
  onOpen?: () => void
  onDelete?: () => void
  onMove?: () => void
}

export const FilePreviewCard = ({
  name,
  onOpen,
  onDelete,
  onMove,
}: FilePreviewCardProps): JSX.Element => {
  const { url } = useRouteMatch()
  const encodedName = encodeURIComponent(name)

  return (
    <Box position="relative" h="100%">
      <LinkBox position="relative" h="100%">
        <LinkOverlay
          as={RouterLink}
          to={`${url}/editMediaSettings/${encodedName}`}
        >
          <Card variant="multi">
            <CardBody>
              <Icon as={BxFileArchiveSolid} fontSize="1.5rem" fill="icon.alt" />
              <Text textStyle="body-1" color="text.label" noOfLines={3}>
                {name}
              </Text>
            </CardBody>
          </Card>
        </LinkOverlay>
      </LinkBox>
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
    </Box>
  )
}
