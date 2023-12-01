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

import { FormDescription } from "components/Form"

import { useEditorContext } from "contexts/EditorContext"

interface ImageAltTextPopoverProps {
  isOpen: boolean
  onClose: () => void
}

export const ImageAltTextPopover = ({
  isOpen,
  onClose,
}: ImageAltTextPopoverProps): JSX.Element => {
  const { editor } = useEditorContext()
  const methods = useForm({
    mode: "onTouched",
    resolver: yupResolver(
      Yup.object().shape({
        value: Yup.string(),
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
      width: node.attrs.width,
      href: node.attrs.href,
    }

    editor
      .chain()
      .focus()
      .setImage({
        alt: data.value,
        ...isomerImageAttrs,
      })
      .run()

    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      methods.setValue(
        "value",
        editor.state.selection.content().content.firstChild?.attrs.alt ?? ""
      )
    }
  }, [isOpen])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <FormControl isInvalid={!!methods.formState.errors.value}>
          <FormLabel textStyle="subhead-2" mb={0} isRequired>
            Alt text
          </FormLabel>
          <FormDescription>
            A short description for accessibility and SEO
          </FormDescription>

          <HStack mt="0.5rem" gap="0.625rem">
            <Input
              placeholder="Describe your image"
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
