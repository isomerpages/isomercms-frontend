import {
  LinkBox,
  LinkOverlay,
  Icon,
  Divider,
  Text,
  Spacer,
  Box,
} from "@chakra-ui/react"
import { Card, CardBody } from "components/Card"
import { ContextMenu } from "components/ContextMenu"
import { useMemo } from "react"
import { BiEditAlt, BiWrench, BiFolder, BiTrash } from "react-icons/bi"
import { useRouteMatch, Link as RouterLink } from "react-router-dom"

import { pageFileNameToTitle } from "utils"

interface FolderCardProps {
  name: string
  dirContent: string[]
}

export const FolderCard = ({
  name,
  dirContent,
}: FolderCardProps): JSX.Element => {
  const { url } = useRouteMatch()

  const encodedName = encodeURIComponent(name)

  const generatedLink = useMemo(() => {
    return `${url}/subfolders/${encodedName}`
  }, [encodedName, url])

  return (
    <Box position="relative" w="full">
      <Card variant="single">
        <LinkBox>
          <LinkOverlay as={RouterLink} to={generatedLink}>
            <CardBody alignItems="center">
              <Icon as={BiFolder} fontSize="1.5rem" fill="icon.alt" />
              <Text textStyle="subhead-1" color="text.label" noOfLines={1}>
                {pageFileNameToTitle(name)}
              </Text>
              <Spacer />
              <Text textStyle="body-2" whiteSpace="nowrap">
                {`${dirContent.length} item${
                  dirContent.length === 1 ? "" : "s"
                }`}
              </Text>
              {/* 
            NOTE: This is a workaround as our card component uses a HStack to orient elements with 1 rem spacing.
            As we require 1.5 rem gap between text and the context menu button, this equates to a box width of 0.5 rem.
            */}
              <Box w="0.5rem" />
            </CardBody>
          </LinkOverlay>
        </LinkBox>
      </Card>

      <ContextMenu>
        <ContextMenu.Button />
        <ContextMenu.List>
          <ContextMenu.Item
            icon={<BiEditAlt />}
            as={RouterLink}
            to={generatedLink}
          >
            <Text>Edit</Text>
          </ContextMenu.Item>
          <ContextMenu.Item
            icon={<BiWrench />}
            as={RouterLink}
            to={`${url}/editDirectorySettings/${encodedName}`}
          >
            Settings
          </ContextMenu.Item>
          <Divider />
          <ContextMenu.Item
            icon={<BiTrash />}
            as={RouterLink}
            to={`${url}/deleteDirectory/${encodedName}`}
          >
            Delete
          </ContextMenu.Item>
        </ContextMenu.List>
      </ContextMenu>
    </Box>
  )
}
