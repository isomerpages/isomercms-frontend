import {
  Card,
  Flex,
  SimpleGrid,
  Text,
  VStack,
  CardHeader,
  CardBody,
  CardFooter,
  Icon,
  Grid,
  GridItem,
  ButtonGroup,
} from "@chakra-ui/react"
import {
  IconButton,
  Button,
  Infobox,
  Textarea,
} from "@opengovsg/design-system-react"
import _ from "lodash"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { BiGridAlt, BiPlus } from "react-icons/bi"
import { useParams } from "react-router-dom"

import { Editable } from "components/Editable"
import PagePreview from "components/pages/PagePreview"

import { EditorContextProvider, useEditorContext } from "contexts/EditorContext"

import { useGetPageHook } from "hooks/pageHooks"

import { Editor } from "../../components/Editor/Editor"
import { EditPageLayout } from "../EditPageLayout"

import { useBlocks } from "./BlocksContext"
import { BLOCKS_CONTENT } from "./constants"
import { Preview } from "./Preview"
import { BlockAddView } from "./types"
import { usePreviewEditor } from "./useBlockEditor"

export const AddBlockView = () => {
  const { curTab } = useBlocks()

  if (curTab !== "add") return null

  return (
    <VStack spacing="1.25rem" p="1.25rem" h="100%" align="flex-start">
      <Text textStyle="subhead-3">Content Blocks</Text>
      <SimpleGrid columns={2} spacing="1.25rem">
        {_.map(BLOCKS_CONTENT, (block) => (
          <BlockContentCard {...block} />
        ))}
      </SimpleGrid>
      <Infobox>
        We are slowly introducing new content types. Looking to add a specific
        kind of content to your pages? Let us know here.
      </Infobox>
    </VStack>
  )
}

export const BlockContentCard = ({
  title,
  description,
  icon,
  variant,
  getContent,
}: BlockAddView & { getContent: (val: string) => string }) => {
  const { showContentView } = useBlocks()
  const { editor } = useEditorContext()
  const [isEditable, setIsEditable] = useState(false)
  const { register, handleSubmit } = useForm()
  const onSave = handleSubmit((data) => {
    showContentView()
    const { size } = editor.view.state.doc.content
    editor?.commands.insertContentAt(
      size,
      `<div data-type="draggable-item">${getContent(data[variant])}</div>`
    )
  })

  return (
    // TODO: Fix the styling for cards - have too much padding
    <Card shadow="none" border="1px solid" borderColor="base.divider.medium">
      <CardHeader>
        <Flex flexDir="row" align="center">
          <Icon fontSize="1.25rem" mr="0.5rem">
            {icon({})}
          </Icon>
          <Text>{title}</Text>
        </Flex>
      </CardHeader>
      <CardBody py={0}>
        {isEditable ? (
          <Textarea
            {...register(variant)}
            placeholder="Put your desired content here"
          />
        ) : (
          <Text>{description}</Text>
        )}
      </CardBody>
      <CardFooter justify="flex-end">
        {isEditable ? (
          <ButtonGroup>
            <Button
              variant="clear"
              colorScheme="critical"
              onClick={() => setIsEditable(false)}
            >
              Cancel
            </Button>
            <Button variant="clear" onClick={onSave}>
              Add to page
            </Button>
          </ButtonGroup>
        ) : (
          <Button variant="clear" onClick={() => setIsEditable(true)}>
            Add to page
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export const BlocksEditPage = () => {
  const params = useParams<{ siteName: string }>()
  const { data: initialPageData, isLoading: isLoadingPage } = useGetPageHook(
    params
  )
  const { curTab, showAddView, showContentView } = useBlocks()

  const editor = usePreviewEditor()

  if (!editor) return null

  return (
    <EditorContextProvider editor={editor}>
      <EditPageLayout
        setEditorContent={(content) => {
          editor.commands.setContent(content)
        }}
        getEditorContent={() => editor.getHTML()}
        variant="blocks"
      >
        {/* TODO: Add in icons at bottom for guide + settings etc */}
        <VStack
          px="0.5rem"
          py="1rem"
          bg="base.canvas.default"
          h="100vh"
          borderRight="1px solid"
          borderColor="base.divider.medium"
        >
          <IconButton
            variant="clear"
            isActive={curTab === "content"}
            aria-label="Show blocks"
            onClick={showContentView}
          >
            <BiGridAlt />
          </IconButton>
          <IconButton
            variant="clear"
            aria-label="Show blocks"
            isActive={curTab === "add"}
            onClick={showAddView}
          >
            <BiPlus />
          </IconButton>
        </VStack>
        <Grid templateColumns="36rem 1fr" w="100%" h="100%">
          <GridItem>
            <VStack h="100%">
              <Editable.Sidebar title="Edit Content" w="36rem" h="100%" pb={0}>
                {curTab !== "add" && (
                  <Editor editor={editor} maxW="100%" maxH="100vh" />
                )}
                <AddBlockView />
              </Editable.Sidebar>
            </VStack>
          </GridItem>
          {/* Preview */}
          <GridItem>
            <Preview
              title={initialPageData?.content?.frontMatter?.title || ""}
            />
          </GridItem>
        </Grid>
      </EditPageLayout>
    </EditorContextProvider>
  )
}
