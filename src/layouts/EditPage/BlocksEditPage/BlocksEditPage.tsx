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
} from "@chakra-ui/react"
import { DragDropContext } from "@hello-pangea/dnd"
import { IconButton, Button, Infobox } from "@opengovsg/design-system-react"
import _ from "lodash"
import { useEffect, useState } from "react"
import { BiGridAlt, BiPlus } from "react-icons/bi"
import { useParams } from "react-router-dom"

import { Editable } from "components/Editable"
import PagePreview from "components/pages/PagePreview"

import { useEditorContext } from "contexts/EditorContext"

import { useGetPageHook } from "hooks/pageHooks"

import { HomepageStartEditingImage } from "assets"

import { Editor } from "../../components/Editor/Editor"
import { DEFAULT_BODY } from "../constants"
import { EditPageLayout } from "../EditPageLayout"

import { BlockEditor } from "./BlockEditor"
import { useBlocks } from "./BlocksContext"
import { BLOCKS_CONTENT } from "./constants"
import { BlockAddView } from "./types"

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
}: BlockAddView) => {
  const { addBlock, showContentView } = useBlocks()

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
      <CardBody py={0}>{description}</CardBody>
      <CardFooter justify="flex-end">
        <Button
          variant="clear"
          onClick={() => {
            addBlock(variant)
            showContentView()
          }}
        >
          Add to page
        </Button>
      </CardFooter>
    </Card>
  )
}

export const ContentView = () => {
  const { blocks, curTab, focus } = useBlocks()

  if (curTab !== "content") return null

  return (
    <Editable.Accordion
      h="100%"
      onChange={(idx) => {
        if (idx > -1) focus(idx)
      }}
    >
      <Editable.Droppable editableId="Blocks" h="100%">
        <Editable.EmptySection
          title="Build your page with blocks"
          subtitle="Now, you can use building blocks to place content on your page. 
          Explore what blocks you can use to put your page together!"
          image={<HomepageStartEditingImage />}
          isEmpty={blocks.length === 0}
        >
          <VStack
            maxH="calc(100vh - 64px)"
            overflow="auto"
            spacing="1.25rem"
            p="1.5rem"
            h="100%"
          >
            {blocks.map(({ variant }, index) => {
              return (
                <Editable.DraggableAccordionItem title={variant} index={index}>
                  <BlockEditor
                    maxW="full"
                    border="none"
                    variant={variant}
                    index={index}
                  />
                </Editable.DraggableAccordionItem>
              )
            })}
          </VStack>
        </Editable.EmptySection>
      </Editable.Droppable>
    </Editable.Accordion>
  )
}

const EditView = () => {
  const { curTab, blocks, curBlockIdx } = useBlocks()
  const { editor } = useEditorContext()

  useEffect(() => {
    if (curBlockIdx > -1) {
      blocks[curBlockIdx].content = editor.getHTML()
    }
  }, [blocks, curBlockIdx, editor])

  if (curTab !== "edit") return null

  return <Editor maxW="full" />
}

export const BlocksEditPage = () => {
  const params = useParams<{ siteName: string }>()
  const { data: initialPageData, isLoading: isLoadingPage } = useGetPageHook(
    params
  )
  const {
    curTab,
    showAddView,
    showContentView,
    onDragEnd,
    blocks,
  } = useBlocks()

  const { editor } = useEditorContext()

  // useEffect(() => {
  //   if (!isLoadingPage) {
  //     // NOTE: If the page load is completed, set the content
  //     // only if the existing page body has content.
  //     if (initialPageData?.content?.pageBody) {
  //       editor?.commands.setContent(initialPageData?.content?.pageBody)
  //     } else {
  //       // Otherwise, prefill with the default
  //       editor?.commands.setContent(DEFAULT_BODY)
  //     }
  //   }
  //   // NOTE: We disable as the editor is a class and holds its own internal state.
  //   // Adding it here would cause a render on every keystroke.
  // }, [editor, isLoadingPage, initialPageData?.content?.pageBody])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <EditPageLayout
        setEditorContent={(content) => {
          editor.commands.setContent(content)
        }}
        getEditorContent={() => editor.getHTML()}
        variant="tiptap"
      >
        {/* TODO: Add in icons at bottom for guide + settings etc */}
        <VStack
          px="0.5rem"
          py="1rem"
          bg="base.canvas.default"
          h="full"
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
                <ContentView />
                <AddBlockView />
                {/* <EditView /> */}
              </Editable.Sidebar>
            </VStack>
          </GridItem>
          {/* Preview */}
          <GridItem>
            <PagePreview
              chunk={blocks.map(({ content }) => content).join("<br />")}
              title={initialPageData?.content?.frontMatter?.title || ""}
            />
          </GridItem>
        </Grid>
      </EditPageLayout>
    </DragDropContext>
  )
}
