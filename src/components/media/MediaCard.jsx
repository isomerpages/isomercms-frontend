import {
  chakra,
  Divider,
  Box,
  HStack,
  Icon,
  Text,
  useToken,
  VStack,
} from "@chakra-ui/react"
import { ContextMenu } from "components/ContextMenu"
import PropTypes from "prop-types"
import { BiChevronRight, BiFolder, BiTrash, BiWrench } from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

import useRedirectHook from "hooks/useRedirectHook"

import contentStyles from "styles/isomer-cms/pages/Content.module.scss"
import mediaStyles from "styles/isomer-cms/pages/Media.module.scss"

const MediaCard = ({ type, media, onClick, showSettings = true }) => {
  const { name, mediaUrl } = media
  const encodedName = encodeURIComponent(name)
  const borderColour = useToken("colors", "primary.500")

  const {
    url,
    params: { mediaRoom },
  } = useRouteMatch()

  const { setRedirectToPage } = useRedirectHook()

  return (
    <Box pos="relative" className={mediaStyles.mediaCard}>
      <chakra.button
        type="button"
        key={name}
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          if (onClick) {
            onClick()
          } else
            setRedirectToPage(
              `${url}/editMediaSettings/${encodeURIComponent(name)}`
            )
        }}
        _focus={{
          outline: `2px solid ${borderColour}`,
        }}
        textStyle="body-1"
        textAlign="left"
        w="100%"
        h="100%"
      >
        <VStack h="100%" w="100%">
          {(type === "images" || mediaRoom === "images") && (
            <div className={mediaStyles.mediaCardImagePreviewContainer}>
              <img
                className={mediaStyles.mediaCardImage}
                alt={name}
                // The sanitise parameter is for SVGs. It converts the raw svg data into an image
                src={mediaUrl || "/placeholder_no_image.png"}
              />
            </div>
          )}
          {(mediaRoom === "files" || type === "files") && (
            <div className={mediaStyles.mediaCardFilePreviewContainer}>
              <p>{name.split(".").pop().toUpperCase()}</p>
            </div>
          )}
          <div
            className={`${mediaStyles.mediaCardDescription} ${contentStyles.card} ${contentStyles.component}`}
          >
            <div className={mediaStyles.mediaCardName}>{name}</div>
            {/* Settings dropdown */}
          </div>
        </VStack>
      </chakra.button>
      {showSettings && (
        <ContextMenu>
          <ContextMenu.Button />
          <ContextMenu.List>
            <ContextMenu.Item
              icon={<BiWrench />}
              as={RouterLink}
              to={`${url}/editMediaSettings/${encodedName}`}
            >
              Image Settings
            </ContextMenu.Item>
            <ContextMenu.Item
              icon={<BiFolder />}
              as={RouterLink}
              to={`${url}/moveMedia/${encodedName}`}
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
                to={`${url}/deleteMedia/${encodedName}`}
              >
                Delete
              </ContextMenu.Item>
            </>
          </ContextMenu.List>
        </ContextMenu>
      )}
    </Box>
  )
}

MediaCard.propTypes = {
  media: PropTypes.shape({
    name: PropTypes.string,
    mediaUrl: PropTypes.string,
  }).isRequired,
}

export default MediaCard
