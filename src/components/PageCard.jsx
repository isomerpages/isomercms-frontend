import {
  LinkOverlay,
  LinkBox,
  Divider,
  HStack,
  Icon,
  Text,
  Flex,
} from "@chakra-ui/react"
import axios from "axios"
import { ContextMenu } from "components/ContextMenu"
import PropTypes from "prop-types"
import { useMemo } from "react"
import {
  BiChevronRight,
  BiEditAlt,
  BiFolder,
  BiTrash,
  BiWrench,
} from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"

// Import utils
import { prettifyDate, pageFileNameToTitle } from "utils"

// axios settings
axios.defaults.withCredentials = true

const PageCard = ({ item, itemIndex }) => {
  const { name, date, resourceType } = item
  const {
    url,
    params: { siteName, resourceRoomName },
  } = useRouteMatch()

  const encodedName = encodeURIComponent(name)

  const generatedLink = useMemo(() => {
    if (resourceType === "file")
      // TODO: implement file preview on CMS
      return "#"
    if (resourceType || resourceRoomName) {
      // use resourceRoomName in case resourcePage does not have format Date-Type-Name.md
      // for resourcePages that are not migrated
      return `${url}/editPage/${encodedName}`
    }
    return `/sites/${siteName}/editPage/${encodedName}`
  }, [resourceType, resourceRoomName, siteName, encodedName, url])

  return (
    <LinkBox
      className={`${contentStyles.component} ${
        resourceType === "file"
          ? contentStyles.cardDisabled
          : contentStyles.card
      } ${elementStyles.card}`}
      position="relative"
    >
      <LinkOverlay as={RouterLink} to={generatedLink}>
        <Flex id={itemIndex} className={contentStyles.componentInfo} h="100%">
          <h1
            className={
              resourceType === "file"
                ? contentStyles.componentTitle
                : contentStyles.componentTitleLink
            }
          >
            {pageFileNameToTitle(name, !!resourceType)}
          </h1>
          <Text textStyle="caption-2" color="GrayText">{`${
            date ? prettifyDate(date) : ""
          }${resourceType ? `/${resourceType.toUpperCase()}` : ""}`}</Text>
        </Flex>
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
            Page Settings
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

PageCard.propTypes = {
  item: PropTypes.shape({
    date: PropTypes.string,
    name: PropTypes.string.isRequired,
    resourceType: PropTypes.oneOf(["file", "post", ""]),
  }),
  itemIndex: PropTypes.number.isRequired,
}

export default PageCard
