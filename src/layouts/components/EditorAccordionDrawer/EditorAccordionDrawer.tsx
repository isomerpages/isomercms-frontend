import { FormControl, Stack, Text } from "@chakra-ui/react"
import { Button, Radio } from "@opengovsg/design-system-react"
import { Editor } from "@tiptap/core"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { AccordionBackgrounds, AccordionBackgroundType } from "types/editPage"

import { EditorDrawer } from "../EditorDrawer"

interface EditorAccordionDrawerProps {
  editor: Editor
  isOpen: boolean
  onClose: () => void
  onProceed: () => void
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const EditorAccordionDrawer = ({
  editor,
  isOpen,
  onClose,
  onProceed,
}: EditorAccordionDrawerProps): JSX.Element => {
  const options = AccordionBackgrounds
  const fragment = editor.state.selection.content().content
  let attrs

  // Not tpp sure why types are wrong here, but this type exists
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (fragment.content && fragment.content.length > 0) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    attrs = fragment.content[0].attrs
  }

  const defaultValue = attrs?.backgroundColor || "white"

  const { register, handleSubmit, watch, setValue } = useForm<{
    "customise-accordion-color": AccordionBackgroundType
  }>()

  useEffect(() => {
    setValue("customise-accordion-color", defaultValue)
    // This is run every time this component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const onSubmit = () => {
    editor.commands.changeDetailGroupBackground(
      watch("customise-accordion-color")
    )
    onProceed()
  }
  return (
    <EditorDrawer isOpen={isOpen}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <EditorDrawer.Header onClose={onClose}>
          <Text as="h5" textStyle="h5">
            Editing accordion
          </Text>
        </EditorDrawer.Header>

        <EditorDrawer.Content>
          <Text>Customise accordion color</Text>
          <FormControl id="customise-accordion-color" mb={6}>
            <Radio.RadioGroup
              name="customise-accordion-color"
              defaultValue={defaultValue}
            >
              <Stack spacing="0.5rem">
                {options.map((o) => (
                  <Radio
                    key={o}
                    value={o}
                    allowDeselect={false}
                    {...register("customise-accordion-color")}
                  >
                    {capitalizeFirstLetter(o)}
                  </Radio>
                ))}
              </Stack>
            </Radio.RadioGroup>
          </FormControl>
        </EditorDrawer.Content>

        <EditorDrawer.Footer>
          <Button type="submit">Save accordion</Button>
        </EditorDrawer.Footer>
      </form>
    </EditorDrawer>
  )
}
