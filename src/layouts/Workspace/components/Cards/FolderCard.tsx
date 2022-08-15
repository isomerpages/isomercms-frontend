import { LinkOverlay, LinkBox, Divider, Text, Icon } from "@chakra-ui/react"
import { Card, CardBody } from "components/Card"
import { ContextMenu } from "components/ContextMenu"
import { BiEditAlt, BiFolder, BiTrash, BiWrench } from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

import { prettifyPageFileName } from "utils"

interface FolderCardProps {
  title: string
  siteName: string
}

export const FolderCard = ({
  title,
  siteName,
}: FolderCardProps): JSX.Element => {
  const { url } = useRouteMatch()

  return (
    <Card variant="single">
      <LinkBox position="relative">
        <LinkOverlay as={RouterLink} to={`/sites/${siteName}/folders/${title}`}>
          <CardBody>
            <Icon as={BiFolder} fontSize="1.5rem" fill="icon.alt" />
            <Text textStyle="subhead-1" color="text.label" noOfLines={1}>
              {prettifyPageFileName(title)}
            </Text>
          </CardBody>
        </LinkOverlay>
      </LinkBox>

      <ContextMenu>
        <ContextMenu.Button position="absolute" />
        <ContextMenu.List>
          <ContextMenu.Item
            icon={<BiEditAlt />}
            as={RouterLink}
            to={`/sites/${siteName}/folders/${title}`}
          >
            <Text>Edit folder</Text>
          </ContextMenu.Item>
          <ContextMenu.Item
            icon={<BiWrench />}
            as={RouterLink}
            to={`${url}/editDirectorySettings/${title}`}
          >
            Folder settings
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
