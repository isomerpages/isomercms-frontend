import {
  Box,
  Flex,
  FormControl,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react"
import { DragDropContext, OnDragEndResponder } from "@hello-pangea/dnd"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, FormLabel, Toggle } from "@opengovsg/design-system-react"
import { Editor } from "@tiptap/core"
import _ from "lodash"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { BiPlus } from "react-icons/bi"
import * as Yup from "yup"

import { Editable } from "components/Editable"
import { EditorDrawer } from "components/EditorDrawer"

import {
  TIPTAP_CARDS_DESCRIPTION_CHAR_LIMIT,
  TIPTAP_CARDS_MAXIMUM,
} from "constants/tiptap"

import { EditableContextProvider } from "contexts/EditableContext"

import { EditorCard, EditorCardsInfo } from "types/editPage"

import { EditorCardItem } from "./EditorCardItem"

const editorCardsInfoSchema = Yup.object().shape({
  isDisplayImage: Yup.boolean(),
  cards: Yup.array()
    .when("isDisplayImage", {
      is: true,
      then: Yup.array().of(
        Yup.object().shape({
          image: Yup.string().required("An image is required"),
          altText: Yup.string().required("Alt text is required"),
          title: Yup.string().required("Title is required"),
          description: Yup.string().max(
            TIPTAP_CARDS_DESCRIPTION_CHAR_LIMIT,
            `Description cannot exceed ${TIPTAP_CARDS_DESCRIPTION_CHAR_LIMIT} characters`
          ),
          linkUrl: Yup.string().required("Link URL is required"),
          linkText: Yup.string().required("Link text is required"),
        })
      ),
      otherwise: Yup.array().of(
        Yup.object().shape({
          title: Yup.string().required("Title is required"),
          description: Yup.string().max(
            TIPTAP_CARDS_DESCRIPTION_CHAR_LIMIT,
            `Description cannot exceed ${TIPTAP_CARDS_DESCRIPTION_CHAR_LIMIT} characters`
          ),
          linkUrl: Yup.string().required("Link URL is required"),
          linkText: Yup.string().required("Link text is required"),
        })
      ),
    })
    .min(1, "At least one card is required")
    .max(TIPTAP_CARDS_MAXIMUM, `Maximum of ${TIPTAP_CARDS_MAXIMUM} cards`),
})

const getEditorCardsContent = (data: EditorCardsInfo): EditorCard[] => {
  const { isDisplayImage, cards } = data

  return cards.map((card) => {
    return {
      image: isDisplayImage ? card.image : "",
      altText: isDisplayImage ? card.altText : "",
      title: card.title,
      description: card.description,
      linkUrl: card.linkUrl,
      linkText: card.linkText,
    }
  })
}

interface EditorCardsDrawerProps {
  editor: Editor
  isOpen: boolean
  onClose: () => void
  onProceed: () => void
}

export const EditorCardsDrawer = ({
  editor,
  isOpen,
  onClose,
  onProceed,
}: EditorCardsDrawerProps): JSX.Element => {
  const [previewState, setPreviewState] = useState<EditorCard[]>([])
  const [initialEditorState, setInitialEditorState] = useState<EditorCard[]>([])
  const methods = useForm<EditorCardsInfo>({
    mode: "onChange",
    resolver: yupResolver(editorCardsInfoSchema),
    defaultValues: {
      isDisplayImage: true,
      cards: [],
    },
  })

  const handleSubmit = (data: EditorCardsInfo) => {
    editor.commands.setCardsContent(getEditorCardsContent(data))
    onProceed()
  }

  const handleClose = () => {
    editor.commands.setCardsContent(initialEditorState)
    onClose()
  }

  const onDragEnd: OnDragEndResponder = ({ source, destination }) => {
    if (!destination) return

    const cards = methods.getValues("cards")

    // Swap cards in source and destination
    const temp = cards[source.index]
    cards[source.index] = cards[destination.index]
    cards[destination.index] = temp

    methods.setValue("cards", cards)
  }

  const onChange = () => {
    // Not needed because we are using react-hook-form
  }

  const onCreate = () => {
    const newCards = [
      ...methods.getValues("cards"),
      {
        image: "https://placehold.co/600x400",
        altText: "",
        title: "This is a title for your card",
        description: "This is body text for your card. Describe your card.",
        linkUrl: "https://www.isomer.gov.sg",
        linkText: "This is a link for your card",
      },
    ]

    methods.setValue("cards", newCards)
  }

  const onDelete = (id: string, type: string) => {
    if (type !== "cards") return

    const index = parseInt(id.split("-")[1], 10)

    methods.setValue(
      "cards",
      methods.getValues("cards").filter((card, i) => i !== index)
    )
  }

  const displayHandler = () => {
    methods.trigger()
  }

  useEffect(() => {
    if (!isOpen) return

    const selection = editor.state.selection.content().content

    if (
      selection.childCount === 1 &&
      selection.child(0).type.name === "isomercards"
    ) {
      const cardGrid = selection.child(0)

      const cards = Array(cardGrid.childCount)
        .fill({})
        .map((item, index) => cardGrid.child(index))
        .map((card) => {
          const output = {
            image: "",
            altText: "",
            title: "",
            description: "",
            linkUrl: "",
            linkText: "",
          }

          if (card.type.name === "isomerclickablecard") {
            output.linkUrl = card.attrs.href || ""
          }

          card.forEach((child) => {
            if (child.type.name === "isomercardimage") {
              const grandChild = child.child(0)

              output.image = grandChild.attrs.src || ""
              output.altText = grandChild.attrs.alt || ""
            } else if (child.type.name === "isomercardbody") {
              child.forEach((grandChild) => {
                switch (grandChild.type.name) {
                  case "isomercardtitle":
                    output.title = grandChild.textContent || ""
                    break
                  case "isomercarddescription":
                    output.description = grandChild.textContent || ""
                    break
                  case "isomercardlink":
                    output.linkText = grandChild.textContent || ""
                    break
                  default:
                    break
                }
              })
            }
          })

          return output
        })

      const isDisplayImage = _.every(cards, (card) => card.image !== "")

      methods.reset({
        isDisplayImage,
        cards,
      })
      editor.commands.setCardsContent(cards)
      setInitialEditorState(cards)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const cards = methods.getValues("cards")
    const isDisplayImage = methods.getValues("isDisplayImage")

    const newState = getEditorCardsContent({ isDisplayImage, cards })

    if (_.isEqual(previewState, newState)) return

    setPreviewState(newState)
    editor.commands.setCardsContent(newState)
  }, [editor.commands, isOpen, methods.formState, previewState])

  return (
    <form onSubmit={methods.handleSubmit(handleSubmit)}>
      <FormProvider {...methods}>
        <EditableContextProvider
          onDragEnd={onDragEnd}
          onChange={onChange}
          onCreate={onCreate}
          onDelete={onDelete}
          onDisplay={displayHandler}
        >
          <EditorDrawer isOpen={isOpen}>
            <EditorDrawer.Header onClose={handleClose}>
              <Text as="h5" textStyle="h5">
                Editing card grid
              </Text>
            </EditorDrawer.Header>

            <EditorDrawer.Content>
              {/* Display images setting */}
              <FormControl isRequired>
                <Flex justifyContent="space-between" w="100%">
                  <Box>
                    <FormLabel mb={0}>Display image</FormLabel>
                    <FormLabel.Description>
                      Applies to all cards in the grid
                    </FormLabel.Description>
                  </Box>
                  <Toggle
                    isRequired={false}
                    label=""
                    {...methods.register("isDisplayImage", {
                      onChange: () => methods.trigger(),
                    })}
                  />
                </Flex>
              </FormControl>

              {/* Cards editing section */}
              <Text as="h6" textStyle="h6" mt="1.5rem">
                Edit content
              </Text>
              <Editable.Accordion onChange={displayHandler}>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Editable.Droppable width="100%" editableId="cards">
                    <VStack
                      spacing="0.75rem"
                      mt="1rem"
                      mb="1.25rem"
                      {...methods.register("cards")}
                    >
                      {!!methods.watch("cards") &&
                        methods
                          .watch("cards")
                          .map((card, index) => (
                            <EditorCardItem index={index} methods={methods} />
                          ))}
                    </VStack>
                  </Editable.Droppable>
                </DragDropContext>
              </Editable.Accordion>

              {/* Add card button */}
              <Button
                variant="clear"
                onClick={onCreate}
                ml="-0.5rem"
                isDisabled={
                  methods.getValues("cards").length >= TIPTAP_CARDS_MAXIMUM
                }
              >
                <HStack spacing="0.5rem">
                  <Icon as={BiPlus} fontSize="1.5rem" />
                  <Text>Add card</Text>
                </HStack>
              </Button>
            </EditorDrawer.Content>

            <EditorDrawer.Footer>
              <Button
                type="submit"
                isDisabled={_.some(methods.formState.errors)}
              >
                Save card grid
              </Button>
            </EditorDrawer.Footer>
          </EditorDrawer>
        </EditableContextProvider>
      </FormProvider>
    </form>
  )
}
