import { FormControl, VStack, Text, Divider } from "@chakra-ui/react"
import { DragDropContext } from "@hello-pangea/dnd"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@opengovsg/design-system-react"
import _ from "lodash"
import { BiPlus } from "react-icons/bi"

import { Editable } from "components/Editable"

import { useEditableContext } from "contexts/EditableContext"

const NUM_MAX_CARDS = 4
interface TextCardFormFields {
  title: string
  description?: string
  linktext: string
  url: string
}

interface TextCardsSectionFormFields {
  title: string
  subtitle?: string
  description?: string
  cards: TextCardFormFields[]
}

interface TextCardsSectionProps extends TextCardsSectionFormFields {
  index: number
  errors: Omit<TextCardsSectionFormFields, "cards">
  cardErrors: TextCardFormFields[]
}

export const TextCardsSectionBody = ({
  title,
  subtitle,
  description,
  cards = [],
  index,
  errors,
  cardErrors = [],
}: TextCardsSectionProps) => {
  const { onChange, onDelete, onDragEnd, onCreate } = useEditableContext()

  return (
    // NOTE: Setting negative margin so that the gap is correct.
    // This is because there is inbuilt padding onto the `AccordionPanels`.
    <Editable.Section>
      <FormControl isInvalid={!!errors.subtitle}>
        <FormLabel>Subtitle</FormLabel>
        <Input
          placeholder="This subtitle appears above the title"
          id={`section-${index}-textcards-subtitle`}
          value={subtitle}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.subtitle}</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors.title}>
        <FormLabel>Title</FormLabel>
        <Input
          placeholder="Your title goes here"
          id={`section-${index}-textcards-title`}
          value={title}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.title}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.description}>
        <FormLabel>Description</FormLabel>
        <Textarea
          placeholder="This description appears below your title. We recommend keeping it as short and succinct as possible."
          id={`section-${index}-textcards-description`}
          value={description}
          onChange={onChange}
        />
        <FormErrorMessage>{errors.description}</FormErrorMessage>
      </FormControl>
      <Divider py="0.5rem" />
      <FormControl isRequired>
        <Text mb="0.5rem" textStyle="h5">
          Cards
        </Text>
        <Text textStyle="body-2" mb="1.5rem">
          Cards are displayed side by side on a desktop screen. You can add up
          to 4 cards
        </Text>
        <DragDropContext onDragEnd={onDragEnd}>
          <Editable.Droppable width="100%" editableId={`textCardItem-${index}`}>
            <Editable.EmptySection
              title="Add a card to get started"
              subtitle="You must add at least 1 card to this block"
              isEmpty={cards.length === 0}
            >
              <Editable.Accordion>
                <VStack p={0} spacing="0.75rem">
                  {cards.map((card, cardIndex) => (
                    <Editable.DraggableAccordionItem
                      draggableId={`textCardItem-${index}-${cardIndex}-draggable`}
                      index={cardIndex}
                      title={card.title}
                      isInvalid={_.some(cardErrors[cardIndex])}
                      isNested
                    >
                      <Editable.Section>
                        <FormControl
                          isRequired
                          isInvalid={!!cardErrors[cardIndex].title}
                        >
                          <FormLabel>Title</FormLabel>
                          <Input
                            placeholder="New card"
                            id={`textCardItem-${index}-${cardIndex}-title`}
                            value={card.title}
                            onChange={onChange}
                          />
                          <FormErrorMessage>
                            {cardErrors[cardIndex].title}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isInvalid={!!cardErrors[cardIndex].description}
                        >
                          <FormLabel>Description</FormLabel>
                          <Textarea
                            placeholder="This is a description for the card. We recommend keeping it short and succinct."
                            id={`textCardItem-${index}-${cardIndex}-description`}
                            value={card.description}
                            onChange={onChange}
                          />
                          <FormErrorMessage>
                            {cardErrors[cardIndex].description}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isRequired
                          isInvalid={!!cardErrors[cardIndex].linktext}
                        >
                          <FormLabel>Link text</FormLabel>
                          <Input
                            placeholder="Learn more"
                            id={`textCardItem-${index}-${cardIndex}-linktext`}
                            value={card.linktext}
                            onChange={onChange}
                          />
                          <FormErrorMessage>
                            {cardErrors[cardIndex].linktext}
                          </FormErrorMessage>
                        </FormControl>
                        <FormControl
                          isRequired
                          isInvalid={!!cardErrors[cardIndex].url}
                        >
                          <FormLabel mb="0">Link URL</FormLabel>
                          <Text
                            mb="0.75rem"
                            textStyle="body-2"
                            textColor="base.content.medium"
                          >
                            Clicking on the card will open this URL
                          </Text>
                          <Input
                            placeholder="Insert /page-url or https://"
                            id={`textCardItem-${index}-${cardIndex}-url`}
                            value={card.url}
                            onChange={onChange}
                          />
                          <FormErrorMessage>
                            {cardErrors[cardIndex].url}
                          </FormErrorMessage>
                        </FormControl>
                        <Button
                          id={`textCardItem-${index}-${cardIndex}`}
                          onClick={() =>
                            onDelete(
                              `textCardItem-${index}-${cardIndex}`,
                              "Card"
                            )
                          }
                          alignSelf="center"
                          variant="clear"
                          colorScheme="critical"
                        >
                          Delete card
                        </Button>
                      </Editable.Section>
                    </Editable.DraggableAccordionItem>
                  ))}
                </VStack>
              </Editable.Accordion>
            </Editable.EmptySection>
          </Editable.Droppable>
        </DragDropContext>
      </FormControl>
      <Button
        id={`textCardItem-${index}-create`}
        variant="outline"
        w="full"
        pt="0.5rem"
        leftIcon={<BiPlus fontSize="1.5rem" />}
        isDisabled={cards.length >= NUM_MAX_CARDS}
        onClick={() => {
          onCreate({
            target: {
              id: `textCardItem-${index}`,
            },
          })
        }}
      >
        Add card
      </Button>
      <Button
        id={`section-${index}`}
        onClick={() => onDelete(`section-${index}`, "Text Cards Section")}
        alignSelf="center"
        variant="clear"
        colorScheme="critical"
        mt="1rem"
      >
        Delete cards
      </Button>
    </Editable.Section>
  )
}
