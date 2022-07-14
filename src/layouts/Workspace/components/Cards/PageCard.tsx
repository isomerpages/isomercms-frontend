import {
  Divider,
  HStack,
  Icon,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react"
import { Card, CardBody } from "components/Card"
import { ContextMenu } from "components/ContextMenu"
import { useMemo } from "react"
import {
  BiChevronRight,
  BiEditAlt,
  BiFileBlank,
  BiFolder,
  BiTrash,
  BiWrench,
} from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

import { pageFileNameToTitle } from "utils"

interface PageCardProps {
  title: string
}

// eslint-disable-next-line import/prefer-default-export
export const PageCard = ({ title }: PageCardProps): JSX.Element => {
  const {
    url,
    params: { siteName },
  } = useRouteMatch<{ siteName: string; resourceRoomName: string }>()

  const encodedName = encodeURIComponent(title)

  const generatedLink = useMemo(() => {
    return `/sites/${siteName}/editPage/${encodedName}`
  }, [siteName, encodedName])

  return (
    <LinkBox>
      <LinkOverlay as={RouterLink} to={generatedLink}>
        <Card variant="single">
          <CardBody>
            <Icon as={BiFileBlank} fontSize="1.5rem" fill="icon.alt" />
            <Text textStyle="subhead-1" color="text.label" noOfLines={1}>
              {pageFileNameToTitle(title)}
            </Text>
          </CardBody>
        </Card>
      </LinkOverlay>
      <ContextMenu>
        <ContextMenu.Button />
        <ContextMenu.List>
          <ContextMenu.Item
            icon={<BiEditAlt />}
            as={RouterLink}
            to={generatedLink}
          >
            <Text>Edit page</Text>
          </ContextMenu.Item>
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
    </LinkBox>
  )
}
