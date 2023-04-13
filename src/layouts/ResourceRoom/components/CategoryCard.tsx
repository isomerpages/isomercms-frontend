import { Divider, Icon, LinkBox, LinkOverlay, Text } from "@chakra-ui/react"
import { Card, CardBody } from "components/Card"
import { ContextMenu } from "components/ContextMenu"
import { BiEditAlt, BiFolder, BiTrash, BiWrench } from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

import { prettifyPageFileName } from "utils"

interface CategoryCardProps {
  title: string
}

// eslint-disable-next-line import/prefer-default-export
export const CategoryCard = ({ title }: CategoryCardProps): JSX.Element => {
  const { url } = useRouteMatch<{
    siteName: string
    resourceRoomName: string
  }>()

  const generatedLink = `${url}/resourceCategory/${title}`

  return (
    <Card variant="single">
      <LinkBox>
        <LinkOverlay as={RouterLink} to={generatedLink}>
          <CardBody>
            <Icon as={BiFolder} fontSize="1.5rem" fill="icon.alt" />
            <Text textStyle="subhead-1" color="text.label" noOfLines={1}>
              {prettifyPageFileName(title)}
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
            <Text>Edit category</Text>
          </ContextMenu.Item>
          <ContextMenu.Item
            icon={<BiWrench />}
            as={RouterLink}
            to={`${url}/editDirectorySettings/${title}`}
          >
            Category settings
          </ContextMenu.Item>
          <>
            <Divider />
            <ContextMenu.Item
              icon={<BiTrash />}
              as={RouterLink}
              to={`${url}/deleteDirectory/${title}`}
            >
              Delete
            </ContextMenu.Item>
          </>
        </ContextMenu.List>
      </ContextMenu>
    </Card>
  )
}
