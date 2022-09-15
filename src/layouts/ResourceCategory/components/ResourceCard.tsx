import {
  LinkBox,
  LinkOverlay,
  Icon,
  Text,
  Divider,
  HStack,
  Box,
} from "@chakra-ui/react"
import { Card, CardBody, CardFooter } from "components/Card"
import { ContextMenu } from "components/ContextMenu"
import {
  BiChevronRight,
  BiEditAlt,
  BiFileBlank,
  BiFolder,
  BiLink,
  BiTrash,
  BiWrench,
} from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

import { BxFileArchiveSolid } from "assets"
import { ResourcePageData } from "types/directory"
import { prettifyDate } from "utils"

interface ResourceCardProps {
  name: string
  title: string
  date: string
  resourceType: ResourcePageData["resourceType"]
}

const getIcon = (resourceType: string): JSX.Element => {
  switch (resourceType) {
    case "post":
      return <Icon as={BiFileBlank} fontSize="1.5rem" fill="icon.alt" />
    case "link":
      return <Icon as={BiLink} fontSize="1.5rem" fill="icon.alt" />
    default:
      return <Icon as={BxFileArchiveSolid} fontSize="1.5rem" fill="icon.alt" />
  }
}

export const ResourceCard = ({
  name,
  title,
  date,
  resourceType,
}: ResourceCardProps): JSX.Element => {
  const { url } = useRouteMatch()
  const encodedName = encodeURIComponent(name)
  const CardContent = () => (
    <Card variant="multi">
      <CardBody>
        {getIcon(resourceType)}
        <Text textStyle="body-1" color="text.label" noOfLines={3}>
          {title}
        </Text>
      </CardBody>
      <CardFooter textAlign="left" ml="2.5rem">
        <Text textStyle="caption-2" color="GrayText">{`${prettifyDate(
          date
        )}/${resourceType?.toUpperCase()}`}</Text>
      </CardFooter>
    </Card>
  )
  const RenderedCard = () =>
    resourceType === "file" || resourceType === "link" ? (
      // NOTE: This is a workaround as the base card has styling for pointer events on it.
      // This is to avoid triggering hover/focus states on mouseover so that users
      // are aware that this cannot be interacted with.
      <Box pointerEvents="none" h="100%">
        <CardContent />
      </Box>
    ) : (
      <LinkBox position="relative" h="100%">
        <LinkOverlay as={RouterLink} to={`${url}/editPage/${encodedName}`}>
          <CardContent />
        </LinkOverlay>
      </LinkBox>
    )

  return (
    <Box position="relative" h="100%">
      <RenderedCard />
      <ContextMenu>
        <ContextMenu.Button />
        <ContextMenu.List>
          {/* NOTE: FILE type pages are NOT editable and hence do not have this option */}
          {resourceType === "post" && (
            <ContextMenu.Item
              icon={<BiEditAlt />}
              as={RouterLink}
              to={`${url}/editPage/${encodedName}`}
            >
              <Text>Edit page</Text>
            </ContextMenu.Item>
          )}
          <ContextMenu.Item
            icon={<BiWrench />}
            as={RouterLink}
            to={`${url}/editPageSettings/${encodedName}`}
          >
            Page settings
          </ContextMenu.Item>
          <ContextMenu.Item
            icon={<BiFolder />}
            as={RouterLink}
            to={`${url}/movePage/${encodedName}`}
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
              to={`${url}/deletePage/${encodedName}`}
            >
              Delete
            </ContextMenu.Item>
          </>
        </ContextMenu.List>
      </ContextMenu>
    </Box>
  )
}
