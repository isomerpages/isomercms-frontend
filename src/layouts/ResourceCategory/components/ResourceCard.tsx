import {
  LinkBox,
  LinkOverlay,
  Icon,
  Text,
  Divider,
  HStack,
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

import { prettifyDate } from "utils"

interface ResourceCardProps {
  title: string
  date: string
}
export const ResourceCard = ({
  title,
  date,
}: ResourceCardProps): JSX.Element => {
  const { url } = useRouteMatch()
  const encodedTitle = encodeURIComponent(title)

  return (
    <LinkBox position="relative">
      <LinkOverlay as={RouterLink} to={`${url}/editPage/${encodedTitle}`}>
        <Card variant="multi" height="100%">
          <CardBody>
            <Icon as={BiFolder} fontSize="1.5rem" fill="icon.alt" />
            <Text textStyle="body-1" color="text.label">
              {title}
            </Text>
          </CardBody>
          <CardFooter textAlign="left" ml="2.5rem">
            <Text textStyle="caption-2" color="GrayText">{`${prettifyDate(
              date
            )}/POST`}</Text>
          </CardFooter>
        </Card>
      </LinkOverlay>
      <ContextMenu>
        <ContextMenu.Button />
        <ContextMenu.List>
          <ContextMenu.Item
            icon={<BiEditAlt />}
            as={RouterLink}
            to={`${url}/editPage/${encodedTitle}`}
          >
            <Text>Edit page</Text>
          </ContextMenu.Item>
          <ContextMenu.Item
            icon={<BiWrench />}
            as={RouterLink}
            to={`${url}/editPageSettings/${encodedTitle}`}
          >
            Page Settings
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
    </LinkBox>
  )
}
