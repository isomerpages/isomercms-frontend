import {
  Box,
  Center,
  chakra,
  Grid,
  GridItem,
  Image,
  Text,
  useMultiStyleConfig,
  VStack,
} from "@chakra-ui/react"
import { Checkbox } from "@opengovsg/design-system-react"
import { BiEditAlt, BiTrash } from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

import { ContextMenu } from "components/ContextMenu"

import useRedirectHook from "hooks/useRedirectHook"

import { convertUtcToTimeDiff } from "utils/dateUtils"

import { CARD_THEME_KEY } from "theme/components/Card"

export interface ImagePreviewCardProps {
  name: string
  addedTime: number
  mediaUrl: string
  isSelected: boolean
  isMenuNeeded?: boolean
  onOpen?: () => void
  onCheck?: () => void
  onDelete?: () => void
}

// Note: This is written as a separate component as the current Card API is not
// flexible enough to support this use case.
export const ImagePreviewCard = ({
  name,
  addedTime,
  mediaUrl,
  isSelected,
  isMenuNeeded = true,
  onOpen,
  onCheck,
  onDelete,
}: ImagePreviewCardProps): JSX.Element => {
  const { url } = useRouteMatch()
  const { setRedirectToPage } = useRedirectHook()
  const encodedName = encodeURIComponent(name)
  const styles = useMultiStyleConfig(CARD_THEME_KEY, {})
  const relativeTime = convertUtcToTimeDiff(addedTime)

  return (
    <Box position="relative" h="100%" data-group>
      {/* Checkbox overlay over image */}
      <Checkbox
        position="absolute"
        left="0"
        top="0"
        h="3.25rem"
        w="3.25rem"
        size="md"
        p="1rem"
        variant="transparent"
        display={isSelected ? "inline-block" : "none"}
        _groupHover={{
          bg: "transparent",
          display: "inline-block",
        }}
        _focusWithin={{
          outline: "none",
        }}
        zIndex={1}
        isChecked={isSelected}
        onChange={() => {
          if (onCheck) onCheck()
        }}
      />

      <Grid
        as={chakra.button}
        overflowY="hidden"
        __css={styles.container}
        p={0}
        gridTemplateRows="1fr 4.5rem"
        gridTemplateColumns="1fr 1fr"
        gridTemplateAreas="'image image' 'footer footer'"
        borderRadius="0.25rem"
        _hover={{ bg: undefined }}
        borderWidth="0px"
        // Note: Outline is required to avoid the card from shifting when selected
        outline={isSelected ? "solid 2px" : "solid 1px"}
        outlineColor={isSelected ? "base.divider.brand" : "base.divider.medium"}
        onClick={() =>
          setRedirectToPage(`${url}/editMediaSettings/${encodedName}`)
        }
      >
        <GridItem gridArea="image">
          <Box position="relative" backgroundColor="base.canvas.overlay">
            {/* White overlay over image */}
            <Box
              position="absolute"
              h="100%"
              w="100%"
              left="0"
              top="0"
              pointerEvents="none"
              backgroundColor="white"
              opacity="0"
              _groupHover={{ opacity: 0.25 }}
            />

            <Center>
              <Image
                align="center"
                height="15rem"
                src={mediaUrl}
                fallbackSrc="/placeholder_no_image.png"
                pointerEvents="all"
                backgroundColor="white"
              />
            </Center>
          </Box>
        </GridItem>
        <GridItem
          gridArea="footer"
          paddingInline="1rem"
          py="0.875rem"
          borderTopWidth="1px"
          borderColor="border.divider.alt"
          bgColor="base.canvas.default"
          _groupHover={{
            bgColor: "base.canvas.brand-subtle",
          }}
          w="100%"
        >
          <Grid
            gridTemplateColumns={isMenuNeeded ? "1fr 2.75rem" : "1fr 0px"}
            gridTemplateAreas="'content button'"
          >
            <VStack
              alignItems="flex-start"
              gridArea="content"
              spacing="0.25rem"
            >
              <Text
                textStyle="subhead-1"
                textColor="base.content.strong"
                textAlign="left"
                noOfLines={1}
                wordBreak="break-all"
              >
                {name}
              </Text>
              <Text textStyle="caption-1" textColor="base.content.medium">
                Added {relativeTime}
              </Text>
            </VStack>
            <Box gridArea="button" />
          </Grid>
        </GridItem>
      </Grid>
      {isMenuNeeded && (
        <ContextMenu onOpen={onOpen}>
          <ContextMenu.Button />
          <ContextMenu.List>
            <ContextMenu.Item
              icon={<BiEditAlt />}
              as={RouterLink}
              to={`${url}/editMediaSettings/${encodedName}`}
            >
              <Text>Rename image</Text>
            </ContextMenu.Item>
            <ContextMenu.Item
              icon={<BiTrash />}
              color="interaction.critical.default"
              onClick={onDelete}
            >
              <Text>Delete image</Text>
            </ContextMenu.Item>
          </ContextMenu.List>
        </ContextMenu>
      )}
    </Box>
  )
}
