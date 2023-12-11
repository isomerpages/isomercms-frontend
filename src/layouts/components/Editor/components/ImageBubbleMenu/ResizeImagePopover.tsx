import {
  FormControl,
  HStack,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react"
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

interface ResizeImagePopoverProps {
  isOpen: boolean
  onClose: () => void
}

export const ResizeImagePopover = ({
  isOpen,
  onClose,
}: ResizeImagePopoverProps): JSX.Element => {
  const { editor } = useEditorContext()

  const methods = useForm({
    mode: "onTouched",
    resolver: yupResolver(
      Yup.object().shape({
        value: Yup.number()
          .transform((value) => (Number.isNaN(value) ? null : value))
          .nullable()
          .required("Please enter a valid percentage")
          .integer("Please enter a whole number")
          .min(1, "Minimum is 1%")
          .max(100, "Maximum is 100%"),
      })
    ),
    defaultValues: {
      value: 100,
    },
  })

  const handleSubmit = (data: { value: number }) => {
    const node = editor.state.selection.content().content.firstChild

    if (!node) {
      onClose()
      return
    }

    const isomerImageAttrs = {
      src: node.attrs.src,
      alt: node.attrs.alt,
      href: node.attrs.href,
    }

    editor
      .chain()
      .focus()
      .updateAttributes("image", {
        // use locally scoped style to override width in template scss
        style: `width: ${data.value}%;`,
        ...isomerImageAttrs,
      })
      .run()

    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      const initialValue: string | number =
        editor.state.selection
          .content()
          // regex to parse the width value from style tag
          .content.firstChild?.attrs.style?.match(/width: (\d+)%/)?.[1] ?? 100

      if (typeof initialValue === "string") {
        methods.setValue(
          "value",
          initialValue.endsWith("%")
            ? Number(initialValue.slice(0, -1))
            : Number(initialValue)
        )
      } else {
        methods.setValue("value", initialValue)
      }
    }
  }, [editor.state.selection, isOpen, methods])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <FormControl isInvalid={!!methods.formState.errors.value}>
          <FormLabel textStyle="subhead-2" mb={0} isRequired>
            Image size
          </FormLabel>
          <FormDescription>100% is the original size</FormDescription>

          <HStack mt="0.5rem">
            <InputGroup>
              <Input {...methods.register("value")} />
              <InputRightAddon
                bgColor="transparent"
                borderColor="base.divider.strong"
              >
                %
              </InputRightAddon>
            </InputGroup>

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
