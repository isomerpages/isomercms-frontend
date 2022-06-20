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
  BiFolder,
  BiTrash,
  BiWrench,
} from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"
import type { SetRequired } from "type-fest"

import { BxFileArchiveSolid } from "assets"
import { PageData } from "types/directory"
import { prettifyDate } from "utils"

interface ResourceCardProps {
  title: string
  date: string
  resourceType: SetRequired<PageData, "resourceType">["resourceType"]
}

export const ResourceCard = ({
  title,
  date,
  resourceType,
}: ResourceCardProps): JSX.Element => {
  const { url } = useRouteMatch()
  const encodedTitle = encodeURIComponent(title)
  const CardContent = () => (
    <Card variant="multi" height="100%">
      <CardBody>
        <Icon
          as={resourceType === "post" ? BiFolder : BxFileArchiveSolid}
          fontSize="1.5rem"
          fill="icon.alt"
        />
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
    resourceType === "file" ? (
      // NOTE: This is a workaround as the base card has styling for pointer events on it.
      // This is to avoid triggering hover/focus states on mouseover so that users
      // are aware that this cannot be interacted with.
      <Box pointerEvents="none" h="100%">
        <CardContent />
      </Box>
    ) : (
      <LinkBox position="relative" h="100%">
        <LinkOverlay as={RouterLink} to={`${url}/editPage/${encodedTitle}`}>
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
              to={`${url}/editPage/${encodedTitle}`}
            >
              <Text>Edit page</Text>
            </ContextMenu.Item>
          )}
          <ContextMenu.Item
            icon={<BiWrench />}
            as={RouterLink}
            to={`${url}/editPageSettings/${encodedTitle}`}
          >
            Page settings
          </ContextMenu.Item>
          <ContextMenu.Item
            icon={<BiFolder />}
            as={RouterLink}
            to={`${url}/movePage/${encodedTitle}`}
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
              to={`${url}/deletePage/${encodedTitle}`}
            >
              Delete
            </ContextMenu.Item>
          </>
        </ContextMenu.List>
      </ContextMenu>
    </Box>
  )
}
