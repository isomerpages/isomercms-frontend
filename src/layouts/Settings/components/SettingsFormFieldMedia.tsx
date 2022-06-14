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
import { useFormContext } from "react-hook-form"
import { BiUpload } from "react-icons/bi"

interface FormFieldMediaProps extends Omit<InputProps, "onChange"> {
  name: string
}

/**
 * @precondition This field MUST be used within a FormProvider from react hook forms
 * @param name When using `{...register(<name>)}`, this prop MUST be set to the same name
 */
export const SettingsFormFieldMedia = forwardRef<FormFieldMediaProps, "input">(
  ({ name, ...props }: FormFieldMediaProps, ref): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { setValue, getValues } = useFormContext()
    const selectedMedia: string = getValues(name)

    const onMediaSave = ({
      selectedMediaPath,
    }: {
      selectedMediaPath: string
    }) => {
      setValue(name, selectedMediaPath)
      onClose()
    }

    return (
      <>
        <HStack w="100%" spacing="0.5rem">
          <Input disabled value={selectedMedia} {...props} ref={ref} />
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
