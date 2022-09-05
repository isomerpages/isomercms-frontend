import {
  LinkBox,
  LinkOverlay,
  Icon,
  Text,
  Divider,
  HStack,
  Box,
} from "@chakra-ui/react"
import { Card, CardBody } from "components/Card"
import { ContextMenu } from "components/ContextMenu"
import { BiChevronRight, BiEditAlt, BiFolder, BiTrash } from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

import { BxFileArchiveSolid } from "assets"

interface FilePreviewCardProps {
  name: string
}

export const FilePreviewCard = ({
  name,
}: FilePreviewCardProps): JSX.Element => {
  const { url } = useRouteMatch()
  const encodedName = encodeURIComponent(name)

  return (
    <Box position="relative" h="100%">
      <LinkBox position="relative" h="100%">
        <LinkOverlay as={RouterLink} to={`${url}/editPage/${encodedName}`}>
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
      <ContextMenu>
        <ContextMenu.Button />
        <ContextMenu.List>
          <ContextMenu.Item
            icon={<BiEditAlt />}
            as={RouterLink}
            to={`${url}/editMediaSettings/${encodedName}`}
          >
            <Text>Edit details</Text>
          </ContextMenu.Item>
          <ContextMenu.Item
            icon={<BiFolder />}
            as={RouterLink}
            to={`${url}/moveMedia/${encodedName}`}
          >
            <HStack spacing="4rem" alignItems="center">
              <Text>Move to</Text>
              <Icon as={BiChevronRight} fontSize="1.25rem" />
            </HStack>
          </ContextMenu.Item>
          <>
            <Divider />
            <ContextMenu.Item
              icon={<BiTrash />}
              as={RouterLink}
              to={`${url}/deleteMedia/${encodedName}`}
            >
              Delete page
            </ContextMenu.Item>
          </>
        </ContextMenu.List>
      </ContextMenu>
    </Box>
  )
}
