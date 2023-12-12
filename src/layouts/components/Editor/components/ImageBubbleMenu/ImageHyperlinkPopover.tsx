import { FormControl, HStack } from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import * as Yup from "yup"

import { useEditorContext } from "contexts/EditorContext"

import { LINK_URL_REGEX } from "utils"

interface ImageHyperlinkPopoverProps {
  isOpen: boolean
  onClose: () => void
}

export const ImageHyperlinkPopover = ({
  isOpen,
  onClose,
}: ImageHyperlinkPopoverProps): JSX.Element => {
  const { editor } = useEditorContext()

  const methods = useForm({
    mode: "onTouched",
    resolver: yupResolver(
      Yup.object().shape({
        value: Yup.string().matches(
          new RegExp(LINK_URL_REGEX),
          "Please enter a valid link URL"
        ),
      })
    ),
    defaultValues: {
      value: "",
    },
  })

  const handleSubmit = (data: { value: string }) => {
    const node = editor.state.selection.content().content.firstChild

    if (!node) {
      onClose()
      return
    }

    const isomerImageAttrs = {
      src: node.attrs.src,
      alt: node.attrs.alt,
      width: node.attrs.width,
    }

    editor
      .chain()
      .focus()
      .setImageMeta({
        href: data.value,
        ...isomerImageAttrs,
      })
      .run()

    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      methods.setValue(
        "value",
        editor.state.selection.content().content.firstChild?.attrs.href ?? ""
      )
    }
  }, [isOpen])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <FormControl isInvalid={!!methods.formState.errors.value}>
          <FormLabel textStyle="subhead-2" mb={0} isRequired>
            URL
          </FormLabel>

          <HStack mt="0.5rem" gap="0.625rem">
            <Input
              placeholder="Add a /permalink or https://"
              {...methods.register("value")}
            />

            <Button type="submit" isDisabled={!!methods.formState.errors.value}>
              Save
            </Button>
          </HStack>

          {methods.formState.errors.value && (
            <FormErrorMessage mb={0}>
              {methods.formState.errors.value.message}
            </FormErrorMessage>
          )}
        </FormControl>
      </form>
    </FormProvider>
  )
}
