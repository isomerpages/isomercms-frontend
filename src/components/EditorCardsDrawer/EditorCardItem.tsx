import { Box, FormControl, VStack } from "@chakra-ui/react"
import {
  Button,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
} from "@opengovsg/design-system-react"
import _ from "lodash"
import { UseFormReturn } from "react-hook-form"

import { Editable } from "components/Editable"
import { FormContext } from "components/Form"
import FormFieldMedia from "components/FormFieldMedia"

import { TIPTAP_CARDS_DESCRIPTION_CHAR_LIMIT } from "constants/tiptap"

import { useEditableContext } from "contexts/EditableContext"

import { EditorCardsInfo } from "types/editPage"

interface EditorCardItemProps {
  index: number
  methods: UseFormReturn<EditorCardsInfo, unknown, undefined>
}

export const EditorCardItem = ({
  index,
  methods,
}: EditorCardItemProps): JSX.Element => {
  const { onDelete } = useEditableContext()
  const { errors } = methods.formState

  return (
    <Editable.DraggableAccordionItem
      index={index}
      title={methods.watch(`cards.${index}.title`) || `Card #${index + 1}`}
      draggableId={`cards-${index}`}
      isInvalid={_.some(errors.cards?.[index])}
      isNested
    >
      <VStack w="100%" spacing="1rem" p="0.5rem">
        {/* Card image */}
        {methods.watch("isDisplayImage") && (
          <>
            <Box w="100%">
              <FormContext
                hasError={!!errors.cards?.[index]?.image}
                onFieldChange={(e) =>
                  methods.setValue(`cards.${index}.image`, e.target.value)
                }
              >
                <FormLabel mt="0.25rem" mb="0.5rem" isRequired>
                  Image
                </FormLabel>
                <FormFieldMedia
                  id={`cards.${index}.image`}
                  placeholder="Browse an image"
                  register={methods.register}
                  inlineButtonText="Browse"
                />
                <FormErrorMessage>
                  {errors.cards?.[index]?.image?.message}
                </FormErrorMessage>
              </FormContext>
            </Box>

            {/* Card image alt text */}
            <FormControl
              isRequired
              isInvalid={!!errors.cards?.[index]?.altText}
            >
              <FormLabel mb={0}>Alt text</FormLabel>
              <FormLabel.Description>
                A short description about the image for accessibility and SEO
              </FormLabel.Description>
              <Input
                mt="0.75rem"
                type="text"
                placeholder="Add a descriptive text about the image"
                {...methods.register(`cards.${index}.altText`)}
              />
              <FormErrorMessage>
                {errors.cards?.[index]?.altText?.message}
              </FormErrorMessage>
            </FormControl>
          </>
        )}

        {/* Card title */}
        <FormControl isRequired isInvalid={!!errors.cards?.[index]?.title}>
          <FormLabel mb="0.75rem">Title</FormLabel>
          <Input
            type="text"
            placeholder="This is the title of the card"
            {...methods.register(`cards.${index}.title`)}
          />
          <FormErrorMessage>
            {errors.cards?.[index]?.title?.message}
          </FormErrorMessage>
        </FormControl>

        {/* Card description */}
        <FormControl isInvalid={!!errors.cards?.[index]?.description}>
          <FormLabel mb="0.75rem">Description</FormLabel>
          <Textarea
            mb={!errors.cards?.[index]?.description ? "0.5rem" : undefined}
            placeholder="This is a description for the card"
            {...methods.register(`cards.${index}.description`)}
          />
          {!errors.cards?.[index]?.description ? (
            <FormHelperText>
              {`${Math.max(
                0,
                TIPTAP_CARDS_DESCRIPTION_CHAR_LIMIT -
                  (methods.watch(`cards.${index}.description`)?.length || 0)
              )} ${
                TIPTAP_CARDS_DESCRIPTION_CHAR_LIMIT -
                  (methods.watch(`cards.${index}.description`)?.length || 0) ===
                1
                  ? "character"
                  : "characters"
              } left`}
            </FormHelperText>
          ) : (
            <FormErrorMessage>
              {errors.cards?.[index]?.description?.message}
            </FormErrorMessage>
          )}
        </FormControl>

        {/* Card link URL */}
        <FormControl isRequired isInvalid={!!errors.cards?.[index]?.linkUrl}>
          <FormLabel mb="0.75rem">Link URL</FormLabel>
          <Input
            type="text"
            placeholder="Insert /page-url or https://"
            {...methods.register(`cards.${index}.linkUrl`)}
          />
          <FormErrorMessage>
            {errors.cards?.[index]?.linkUrl?.message}
          </FormErrorMessage>
        </FormControl>

        {/* Card link text */}
        <FormControl isRequired isInvalid={!!errors.cards?.[index]?.linkText}>
          <FormLabel mb="0.75rem">Link text</FormLabel>
          <Input
            type="text"
            placeholder="Enter text to be displayed for the link"
            {...methods.register(`cards.${index}.linkText`)}
          />
          <FormErrorMessage>
            {errors.cards?.[index]?.linkText?.message}
          </FormErrorMessage>
        </FormControl>

        {/* Delete card button */}
        <Button
          variant="clear"
          w="100%"
          id={`cards-${index}`}
          onClick={() => onDelete(`cards-${index}`, "cards")}
          alignSelf="center"
          colorScheme="critical"
        >
          Delete card
        </Button>
      </VStack>
    </Editable.DraggableAccordionItem>
  )
}
