import {
  InputProps,
  useDisclosure,
  Input,
  Button,
  Icon,
  forwardRef,
  HStack,
} from "@chakra-ui/react"
import MediaModal from "components/media/MediaModal"
import { useFormContext, Controller } from "react-hook-form"
import { BiUpload } from "react-icons/bi"

interface FormFieldMediaProps extends Omit<InputProps, "onChange" | "name"> {
  onChange: (value: string) => void
  name: string
}

/**
 * @precondition This field MUST be used within a FormProvider from react hook forms
 * @param name When using `{...register(<name>)}`, this prop MUST be set to the same name
 */
const SettingsFormFieldMediaBase = forwardRef<FormFieldMediaProps, "input">(
  ({ onChange, ...props }: FormFieldMediaProps, ref): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const onMediaSave = ({
      selectedMediaPath,
    }: {
      selectedMediaPath: string
    }) => {
      onChange(selectedMediaPath)
      onClose()
    }

    return (
      <>
        <HStack w="100%" spacing="0.5rem">
          <Input disabled {...props} ref={ref} />
          <Button
            onClick={onOpen}
            leftIcon={<Icon as={BiUpload} fontSize="1.5rem" fill="white" />}
            isDisabled={props.isDisabled}
          >
            Upload Image
          </Button>
        </HStack>
        {isOpen && (
          <MediaModal onClose={onClose} type="images" onProceed={onMediaSave} />
        )}
      </>
    )
  }
)

export const SettingsFormFieldMedia = ({
  name,
  isDisabled,
}: Pick<FormFieldMediaProps, "name" | "isDisabled">): JSX.Element => {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return <SettingsFormFieldMediaBase {...field} isDisabled={isDisabled} />
      }}
    />
  )
}
