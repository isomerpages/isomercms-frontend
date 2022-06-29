import {
  VStack,
  useDisclosure,
  HStack,
  forwardRef,
  Flex,
  Modal,
  ModalContent,
  FormControl,
} from "@chakra-ui/react"
import {
  FormLabel,
  Input,
  Button,
  InputProps,
} from "@opengovsg/design-system-react"
import { upperFirst } from "lodash"
import { useState } from "react"
import { SketchPicker } from "react-color"
import { useFormContext, Controller } from "react-hook-form"

import { Section, SectionHeader } from "layouts/components"

import { varyHexColor } from "utils/colours"

interface ColourSettingsProp {
  isError: boolean
}

export const ColourSettings = ({
  isError,
}: ColourSettingsProp): JSX.Element => {
  return (
    <Section id="colour-fields">
      <SectionHeader label="Colours" />
      <FormControl isDisabled={isError} isRequired>
        <VStack spacing="1rem" align="flex-start" w="50%">
          <FormColourPicker
            name="colours.primaryColour"
            label="Primary"
            isDisabled={isError}
          />
          <FormColourPicker
            name="colours.secondaryColour"
            label="Secondary"
            isDisabled={isError}
          />
          <FormColourPicker
            name="colours.mediaColours.0"
            label="Resource 1"
            isDisabled={isError}
          />
          <FormColourPicker
            name="colours.mediaColours.1"
            label="Resource 2"
            isDisabled={isError}
          />
          <FormColourPicker
            name="colours.mediaColours.2"
            label="Resource 3"
            isDisabled={isError}
          />
          <FormColourPicker
            name="colours.mediaColours.3"
            label="Resource 4"
            isDisabled={isError}
          />
          <FormColourPicker
            name="colours.mediaColours.4"
            label="Resource 5"
            isDisabled={isError}
          />
        </VStack>
      </FormControl>
    </Section>
  )
}

interface FormColourPickerProps extends Omit<InputProps, "onChange" | "value"> {
  name: string
  label: string
  isDisabled?: boolean
  onChange: (colour: string) => void
  value: string
}

const FormColourPicker = ({
  name,
  ...rest
}: Pick<
  FormColourPickerProps,
  "name" | "label" | "isDisabled"
>): JSX.Element => {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return <FormColourPickerBase {...field} {...rest} />
      }}
    />
  )
}

const FormColourPickerBase = forwardRef<FormColourPickerProps, "input">(
  (
    { value, onChange, label, isDisabled, ...rest }: FormColourPickerProps,
    ref
  ): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [colour, setColour] = useState<string>(value)
    const [hasSelectedColour, setHasSelectedColour] = useState(false)
    // Reset colour if user clicks away without selecting so that the button background
    // will always be in sync with the input hex code
    const resetColour = () => {
      if (!hasSelectedColour) {
        setColour(value)
      }
    }

    return (
      <>
        <HStack justify="flex-start" w="100%" spacing="2rem">
          <FormLabel w="25%">{upperFirst(label)}</FormLabel>
          <Flex>
            <Input
              disabled
              {...rest}
              value={value}
              borderRightRadius={0}
              ref={ref}
            />
            <Button
              borderLeftRadius={0}
              isDisabled={isDisabled}
              _hover={{
                backgroundColor: varyHexColor(value, 10),
              }}
              _active={{
                backgroundColor: varyHexColor(value, 20),
              }}
              aria-label="Select colour"
              bgColor={isOpen ? colour : value}
              onClick={onOpen}
            />
          </Flex>
        </HStack>
        <Modal
          onClose={onClose}
          isOpen={isOpen}
          isCentered
          onOverlayClick={resetColour}
          onEsc={resetColour}
        >
          <ModalContent w="auto">
            <SketchPicker
              width="250px"
              color={colour}
              disableAlpha
              onChange={(colourResult) => setColour(colourResult.hex)}
            />
            <Button
              w="100%"
              onClick={() => {
                onChange(colour)
                setHasSelectedColour(true)
                onClose()
              }}
            >
              Select Colour
            </Button>
          </ModalContent>
        </Modal>
      </>
    )
  }
)
