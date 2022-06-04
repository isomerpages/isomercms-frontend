// not completely refactored yet, to finish after Media and Resources
// should create separate display component Card without functionality
import { LinkOverlay, LinkBox, Divider, Text } from "@chakra-ui/react"
import { ContextMenuButton, ContextMenuItem } from "components/ContextMenu"
import PropTypes from "prop-types"
import { useMemo } from "react"
import { BiEditAlt, BiTrash, BiWrench } from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

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
  }, [pageType])

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
      <span
        className={`${contentStyles.componentFolderName} align-self-center ml-4 mr-auto`}
      >
        {displayText || prettifyPageFileName(category)}
      </span>
    </div>
  )

  return (
    <>
      {generatedLink ? (
        <LinkBox
          className={`${contentStyles.component} ${contentStyles.card} ${elementStyles.folderCard}`}
        >
          <LinkOverlay as={RouterLink} to={generatedLink}>
            <FolderCardContent />
          </LinkOverlay>
          {shouldShowContextMenu && (
            <ContextMenuButton>
              <ContextMenuItem
                icon={<BiEditAlt />}
                as={RouterLink}
                to={generatedLink}
              >
                <Text>Edit folder</Text>
              </ContextMenuItem>
              <ContextMenuItem
                icon={<BiWrench />}
                as={RouterLink}
                to={`${url}/editDirectorySettings/${category}`}
              >
                Folder Settings
              </ContextMenuItem>
              <>
                <Divider />
                <ContextMenuItem
                  icon={<BiTrash />}
                  as={RouterLink}
                  to={`${url}/deleteDirectory/${category}`}
                >
                  Delete
                </ContextMenuItem>
              </>
            </ContextMenuButton>
          )}
        </LinkBox>
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
