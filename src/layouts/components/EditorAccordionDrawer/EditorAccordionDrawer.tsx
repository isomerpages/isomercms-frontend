import { FormControl, Stack, Text } from "@chakra-ui/react"
import { Button, Radio } from "@opengovsg/design-system-react"
import { Editor, getAttributes } from "@tiptap/core"
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

  const attributes = getAttributes(editor.state, "detailGroup")

  const backgroundColor: AccordionBackgroundType =
    attributes?.backgroundColor || "white"

  const { register, handleSubmit, watch, setValue } = useForm<{
    "customise-accordion-color": AccordionBackgroundType
  }>({
    defaultValues: {
      "customise-accordion-color": backgroundColor,
    },
  })

  useEffect(() => {
    if (!isOpen) return
    setValue("customise-accordion-color", backgroundColor)
    // This is run every time this component is shown
  }, [isOpen, setValue, backgroundColor])

  const onSubmit = () => {
    editor.commands.changeDetailGroupBackground(
      watch("customise-accordion-color")
    )
    onProceed()
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <EditorDrawer isOpen={isOpen}>
        <EditorDrawer.Header onClose={onClose}>
          <Text as="h5" textStyle="h5">
            Editing accordion
          </Text>
        </EditorDrawer.Header>

        <EditorDrawer.Content>
          <Text mb="0.5rem">Customise accordion colour</Text>
          <FormControl id="customise-accordion-color" mb={6}>
            <Radio.RadioGroup
              name="customise-accordion-color"
              value={watch("customise-accordion-color")}
            >
              <Stack>
                {options.map((option) => (
                  <Radio
                    key={option}
                    value={option}
                    allowDeselect={false}
                    size="sm"
                    {...register("customise-accordion-color")}
                  >
                    {capitalizeFirstLetter(option)}
                  </Radio>
                ))}
              </Stack>
            </Radio.RadioGroup>
          </FormControl>
        </EditorDrawer.Content>

        <EditorDrawer.Footer>
          <Button type="submit">Save accordion</Button>
        </EditorDrawer.Footer>
      </EditorDrawer>
    </form>
  )
}
