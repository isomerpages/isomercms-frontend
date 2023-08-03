// not completely refactored yet, to finish after Media and Resources
// should create separate display component Card without functionality
import { LinkOverlay, LinkBox, Divider, Text, Box } from "@chakra-ui/react"
import PropTypes from "prop-types"
import { useMemo } from "react"
import { BiEditAlt, BiTrash, BiWrench } from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

import { ContextMenu } from "components/ContextMenu"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"

import { prettifyPageFileName } from "utils"

// eslint-disable-next-line import/prefer-default-export
export const FolderCard = ({
  displayText,
  itemIndex,
  pageType,
  siteName,
  category,
  selectedIndex,
  onClick,
  hideSettings,
}) => {
  const shouldShowContextMenu = !(
    hideSettings ||
    pageType === "homepage" ||
    pageType === "contact-us" ||
    pageType === "nav" ||
    pageType === "file"
  )

  const { url } = useRouteMatch()

  const generatedLink = useMemo(() => {
    switch (pageType) {
      case "homepage":
        return `/sites/${siteName}/homepage`
      case "collection":
        return `/sites/${siteName}/folders/${category}`
      case "resources":
        return `${url}/resourceCategory/${category}`
      case "contact-us":
        return `/sites/${siteName}/contact-us`
      case "nav":
        return `/sites/${siteName}/navbar`
      case "images":
      case "files":
        return `/sites/${siteName}/media/${pageType}/mediaDirectory/${category}`
      default:
        return ""
    }
  }, [pageType, siteName, category, url])

  const generatedImage = useMemo(() => {
    switch (pageType) {
      case "homepage":
        return "bxs-home-circle"
      case "contact-us":
        return "bxs-phone"
      case "nav":
        return "bxs-compass"
      case "file":
        return "bxs-file-blank"
      default:
        return "bxs-folder"
    }
  }, [pageType])

  const FolderCardContent = () => (
    <div id={itemIndex} className={`${contentStyles.folderInfo}`}>
      <i
        className={`bx bx-md text-dark ${generatedImage} ${contentStyles.componentIcon}`}
      />
      <span className={`${contentStyles.componentFolderName}`}>
        {displayText || prettifyPageFileName(category)}
      </span>
    </div>
  )

  return (
    <>
      {generatedLink ? (
        <Box
          position="relative"
          className={`${contentStyles.component} ${contentStyles.card} ${elementStyles.folderCard}`}
          p={0}
        >
          <LinkBox w="100%" p="1rem">
            <LinkOverlay
              as={RouterLink}
              to={generatedLink}
              _hover={{
                textColor: "inherit",
              }}
            >
              <FolderCardContent />
            </LinkOverlay>
          </LinkBox>
          {shouldShowContextMenu && (
            <ContextMenu>
              <ContextMenu.Button />
              <ContextMenu.List>
                <ContextMenu.Item
                  icon={<BiEditAlt />}
                  as={RouterLink}
                  to={generatedLink}
                >
                  <Text>Edit folder</Text>
                </ContextMenu.Item>
                <ContextMenu.Item
                  icon={<BiWrench />}
                  as={RouterLink}
                  to={`${url}/editDirectorySettings/${category}`}
                >
                  Folder settings
                </ContextMenu.Item>
                <>
                  <Divider />
                  <ContextMenu.Item
                    icon={<BiTrash />}
                    as={RouterLink}
                    to={`${url}/deleteDirectory/${category}`}
                  >
                    Delete
                  </ContextMenu.Item>
                </>
              </ContextMenu.List>
            </ContextMenu>
          )}
        </Box>
      ) : (
        <button
          id="folderCard-small"
          className={`${contentStyles.component} ${contentStyles.card} ${
            elementStyles.folderCard
          } ${selectedIndex ? `border border-primary` : ""}`}
          onClick={onClick}
          // NOTE: This is to prevent isomercms styling from displaying buttons oddly
          style={{
            font: "inherit",
          }}
          type="button"
        >
          <FolderCardContent />
          {selectedIndex && (
            <div className={elementStyles.orderCircleContainer}>
              <div className={elementStyles.orderCircle}>{selectedIndex}</div>
            </div>
          )}
        </button>
      )}
    </>
  )
}

FolderCard.propTypes = {
  displayText: PropTypes.string.isRequired,
  itemIndex: PropTypes.number,
  pageType: PropTypes.string.isRequired,
  siteName: PropTypes.string.isRequired,
  category: PropTypes.string,
}
