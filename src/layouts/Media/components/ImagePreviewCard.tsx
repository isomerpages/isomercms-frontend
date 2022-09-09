import {
  Divider,
  Text,
  Icon,
  Box,
  chakra,
  VStack,
  Image,
  useMultiStyleConfig,
  Grid,
  GridItem,
  Center,
  HStack,
} from "@chakra-ui/react"
import { ContextMenu } from "components/ContextMenu"
import { BiChevronRight, BiEditAlt, BiFolder, BiTrash } from "react-icons/bi"
import { Link as RouterLink, useRouteMatch } from "react-router-dom"

import useRedirectHook from "hooks/useRedirectHook"

import { CARD_THEME_KEY } from "theme/components/Card"

interface ImagePreviewCardProps {
  name: string
  mediaUrl: string
}

// TODO (#936): This component should be refactored and shifted to new cards once implemented.
// This is written as a separate component as the current Card API is not flexible
// enough to support this use case.
export const ImagePreviewCard = ({
  name,
  mediaUrl,
}: ImagePreviewCardProps): JSX.Element => {
  const { url } = useRouteMatch()
  const styles = useMultiStyleConfig(CARD_THEME_KEY, {})
  const encodedName = encodeURIComponent(name)
  const { setRedirectToPage } = useRedirectHook()
  const fileExt = mediaUrl.split(".").pop()?.split("?").shift()

  return (
    <Box position="relative">
      <Grid
        as={chakra.button}
        overflowY="hidden"
        __css={styles.container}
        p={0}
        gridTemplateRows="1fr 4.5rem"
        gridTemplateColumns="1fr 1fr"
        gridTemplateAreas="'body body' 'footer footer'"
        onClick={() =>
          setRedirectToPage(
            `${url}/editMediaSettings/${encodeURIComponent(name)}`
          )
        }
      >
        <GridItem gridArea="body">
          <Center>
            <Image
              align="center"
              height="15rem"
              src={mediaUrl}
              fallbackSrc="/placeholder_no_image.png"
            />
          </Center>
        </GridItem>
        <GridItem
          gridArea="footer"
          paddingInline="1rem"
          py="0.875rem"
          borderTopWidth="1px"
          borderColor="border.divider.alt"
          bg="blue.50"
        >
          <Grid
            gridTemplateColumns="1fr 2.75rem"
            gridTemplateRows="2.75rem"
            gridTemplateAreas="'content button' 'content button'"
          >
            <VStack
              alignItems="flex-start"
              gridArea="content"
              spacing="0.25rem"
            >
              <Text textStyle="subhead-1">{name}</Text>
              <Text textColor="text.helper" textStyle="caption-1">
                {fileExt}
              </Text>
            </VStack>
            <Box gridArea="button" />
          </Grid>
        </GridItem>
      </Grid>
      <ContextMenu>
        <ContextMenu.Button pos="absolute" bottom="0.875rem" right="1rem" />
        <ContextMenu.List>
          <ContextMenu.Item
            icon={<BiEditAlt />}
            as={RouterLink}
            to={`${url}/editMediaSettings/${encodedName}`}
          >
            <Text>Edit details</Text>
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
              Delete image
            </ContextMenu.Item>
          </>
        </ContextMenu.List>
      </ContextMenu>
    </Box>
  )
}
