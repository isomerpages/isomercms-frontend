import {
  SimpleGrid,
  Box,
  Skeleton,
  Text,
  Button,
  Center,
  Icon,
  VStack,
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react"
import { ContextMenu } from "components/ContextMenu"
import {
  BiBulb,
  BiChevronDown,
  BiChevronUp,
  BiFileBlank,
  BiFolder,
  BiInfoCircle,
} from "react-icons/bi"
import { Link } from "react-router-dom"

import useRedirectHook from "hooks/useRedirectHook"

import { EmptyBoxImage } from "assets/images/EmptyBoxImage"
import { DirectoryData, PageData } from "types/directory"

import {
  Section,
  SectionHeader,
  SectionCaption,
  CreateButton,
} from "../components"

import { PageCard, FolderCard } from "./components"

export const WorkspaceFolders = (props: {
  siteName: string
  pagesData: PageData[]
  url: string
  dirsData: DirectoryData[]
}): JSX.Element => {
  const { setRedirectToPage } = useRedirectHook()
  const { siteName, pagesData, url, dirsData } = props

  return (
    <>
      <Section>
        <Box w="100%">
          <SectionHeader label="Folders">
            <CreateButton
              onClick={() => setRedirectToPage(`${url}/createDirectory`)}
            >
              Create folder
            </CreateButton>
          </SectionHeader>
          <SectionCaption label="PRO TIP: " icon={BiBulb}>
            Folders impact navigation on your site. Organise your workspace by
            moving pages into folders.
          </SectionCaption>
        </Box>
        <Skeleton isLoaded={!!pagesData} w="full">
          <SimpleGrid columns={3} spacing="1.5rem">
            {dirsData &&
              dirsData.length > 0 &&
              dirsData.map(({ name }) => (
                <FolderCard title={name} siteName={siteName} />
              ))}
          </SimpleGrid>
        </Skeleton>
      </Section>
    </>
  )
}

export const UngroupedPages = (props: {
  pagesData: PageData[]
  url: string
}): JSX.Element => {
  const { pagesData, url } = props
  const { setRedirectToPage } = useRedirectHook()
  return (
    <>
      <Section>
        <Box w="100%">
          <SectionHeader label="Ungrouped Pages">
            <CreateButton
              onClick={() => setRedirectToPage(`${url}/createPage`)}
            >
              Create page
            </CreateButton>
          </SectionHeader>
          <SectionCaption label="NOTE: " icon={BiInfoCircle}>
            Pages here do not belong to any folders.
          </SectionCaption>
        </Box>
        <Skeleton isLoaded={!!pagesData} w="full">
          <SimpleGrid columns={3} spacing="1.5rem">
            {pagesData &&
              pagesData.length > 0 &&
              pagesData
                .filter((page) => page.name !== "contact-us.md")
                .map(({ name }) => <PageCard title={name} />)}
          </SimpleGrid>
        </Skeleton>
      </Section>
    </>
  )
}

export const EmptyFolder = (props: { url: string }): JSX.Element => {
  const { url } = props
  const { setRedirectToPage } = useRedirectHook()
  return (
    <>
      <Box as="form" w="full">
        {/* Resource Room does not exist */}
        <VStack spacing={5}>
          <EmptyBoxImage />
          <Center>
            <VStack spacing={0}>
              <Text textStyle="subhead-1">{" There's nothing here yet. "}</Text>
              <Text textStyle="body-2">Create a new item to get started.</Text>
            </VStack>
          </Center>

          <CreateButton
            onClick={() => setRedirectToPage(`${url}/createDirectory`)}
          >
            Create folder
          </CreateButton>
        </VStack>
      </Box>
    </>
  )
}

export const EmptyPage = (props: { url: string }): JSX.Element => {
  const { url } = props
  const { setRedirectToPage } = useRedirectHook()
  return (
    <>
      <Box as="form" w="full">
        {/* Resource Room does not exist */}
        <VStack spacing={5}>
          <EmptyBoxImage />
          <Center>
            <VStack spacing={0}>
              <Text textStyle="subhead-1">There&apos;s nothing here yet.</Text>
              <Text textStyle="body-2">Create a new item to get started.</Text>
            </VStack>
          </Center>
          <CreateButton onClick={() => setRedirectToPage(`${url}/createPage`)}>
            Create page
          </CreateButton>
        </VStack>
      </Box>
    </>
  )
}

export const EmptyPageAndFolder = (props: { url: string }): JSX.Element => {
  const { url } = props
  return (
    <>
      <Box as="form" w="full">
        {/* Resource Room does not exist */}
        <VStack spacing={5}>
          <EmptyBoxImage />
          <Center>
            <VStack spacing={0}>
              <Text textStyle="subhead-1">There&apos;s nothing here yet.</Text>
              <Text textStyle="body-2">Create a new item to get started.</Text>
            </VStack>
          </Center>
          <ContextMenu placement="bottom-end" offset={[0, 0]}>
            {({ isOpen }) => (
              <ButtonGroup isAttached variant="outline">
                {/* NOTE: This is to avoid the 2 joined buttons both having 1px padding,
            which results in a larger border at the attached area. */}
                <Button
                  borderRight="0px"
                  borderRightRadius={0}
                  as={Link}
                  to={`${url}/createPage`}
                  variant="outline"
                >
                  Create page
                </Button>
                <ContextMenu.Button
                  position="inherit"
                  as={IconButton}
                  borderLeftRadius={0}
                  aria-label="Select options"
                  variant="outline"
                  _active={{ bg: "white" }}
                  icon={
                    <Icon
                      as={isOpen ? BiChevronUp : BiChevronDown}
                      fontSize="1rem"
                      fill="blue"
                    />
                  }
                />
                <ContextMenu.List minWidth={150}>
                  <ContextMenu.Item
                    as={Link}
                    to={`${url}/createPage`}
                    icon={<BiFileBlank fontSize="1.25rem" fill="icon.alt" />}
                  >
                    <Text textStyle="body-1" fill="text.body">
                      Create page
                    </Text>
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    as={Link}
                    to={`${url}/createDirectory`}
                    icon={<BiFolder fontSize="1.25rem" fill="icon.alt" />}
                  >
                    <Text textStyle="body-1" fill="text.body">
                      Create folder
                    </Text>
                  </ContextMenu.Item>
                </ContextMenu.List>
              </ButtonGroup>
            )}
          </ContextMenu>
        </VStack>
      </Box>
    </>
  )
}
