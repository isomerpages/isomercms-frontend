import {
  VStack,
  useDisclosure,
  HStack,
  forwardRef,
  Flex,
  Modal,
  ModalContent,
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
import { useFormContext } from "react-hook-form"

import { Section, SectionHeader } from "layouts/components"

import { varyHexColor } from "utils/colours"

interface ColourSettingsProp {
  isError: boolean
}

export const ColourSettings = ({
  isError,
}: ColourSettingsProp): JSX.Element => {
  const { register } = useFormContext()
  return (
    <Section id="colour-fields">
      <SectionHeader label="Colours" />
      <VStack spacing="1rem" align="flex-start" w="50%">
        <FormColourPicker
          {...register("colours.primaryColour")}
          label="Primary"
          isDisabled={isError}
        />
        <FormColourPicker
          {...register("colours.secondaryColour")}
          label="Secondary"
          isDisabled={isError}
        />
        <FormColourPicker
          {...register("colours.mediaColours.0")}
          label="Resource 1"
          isDisabled={isError}
        />
        <FormColourPicker
          {...register("colours.mediaColours.1")}
          label="Resource 2"
          isDisabled={isError}
        />
        <FormColourPicker
          {...register("colours.mediaColours.2")}
          label="Resource 2"
          isDisabled={isError}
        />
        <FormColourPicker
          {...register("colours.mediaColours.3")}
          label="Resource 3"
          isDisabled={isError}
        />
        <FormColourPicker
          {...register("colours.mediaColours.4")}
          label="Resource 4"
          isDisabled={isError}
        />
      </VStack>
    </Section>
  )
}

interface FormColourPickerProps extends InputProps {
  name: string
  label: string
  isDisabled?: boolean
}

const FormColourPicker = forwardRef<FormColourPickerProps, "input">(
  (
    { name, label, isDisabled, ...rest }: FormColourPickerProps,
    ref
  ): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { setValue, getValues } = useFormContext()
    const initialColour: string = getValues(name)
    const [colour, setColour] = useState<string>(initialColour)
    const [hasSelectedColour, setHasSelectedColour] = useState(false)
    // Reset colour if user clicks away without selecting so that the button background
    // will always be in sync with the input hex code
    const resetColour = () => {
      if (!hasSelectedColour) {
        setColour(initialColour)
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
              value={initialColour}
              borderRightRadius={0}
            />
            <Button
              borderLeftRadius={0}
              isDisabled={isDisabled}
              _hover={{
                backgroundColor: varyHexColor(initialColour, 10),
              }}
              _active={{
                backgroundColor: varyHexColor(initialColour, 20),
              }}
              aria-label="Select colour"
              bgColor={colour}
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
                setValue(name, colour)
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
