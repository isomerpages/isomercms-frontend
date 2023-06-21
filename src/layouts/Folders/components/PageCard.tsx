import {
  LinkBox,
  LinkOverlay,
  HStack,
  Icon,
  Divider,
  Text,
  Box,
} from "@chakra-ui/react"
import { useMemo } from "react"
import {
  BiEditAlt,
  BiWrench,
  BiFolder,
  BiChevronRight,
  BiTrash,
  BiFileBlank,
} from "react-icons/bi"
import { useRouteMatch, Link as RouterLink } from "react-router-dom"

import { Card, CardBody } from "components/Card"
import { ContextMenu } from "components/ContextMenu"

import { pageFileNameToTitle } from "utils"

interface PageCardProps {
  name: string
}

export const PageCard = ({ name }: PageCardProps): JSX.Element => {
  const { url } = useRouteMatch()

  const encodedName = encodeURIComponent(name)

  const generatedLink = useMemo(() => {
    return `${url}/editPage/${encodedName}`
  }, [encodedName, url])

  return (
    <Box position="relative" w="full">
      <Card variant="single">
        <LinkBox position="relative">
          <LinkOverlay as={RouterLink} to={generatedLink}>
            <CardBody alignItems="center">
              <Icon as={BiFileBlank} fontSize="1.5rem" fill="icon.alt" />
              <Text textStyle="subhead-1" color="text.label" noOfLines={1}>
                {pageFileNameToTitle(name)}
              </Text>
            </CardBody>
          </LinkOverlay>
        </LinkBox>
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
              to={`${url}/editPageSettings/${encodedName}`}
            >
              Settings
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
            <Divider />
            <ContextMenu.Item
              icon={<BiTrash />}
              as={RouterLink}
              to={`${url}/deletePage/${encodedName}`}
            >
              Delete
            </ContextMenu.Item>
          </ContextMenu.List>
        </ContextMenu>
      </Card>
    </Box>
  )
}
