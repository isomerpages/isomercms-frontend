import { Modal as ChakraModal, ModalProps } from "@chakra-ui/react"

/**
 * NOTE: We are wrapping the Modal component from Chakra UI by enforcing the
 * motion preset to be "none" by default. This is because having animations
 * makes the CMS appear very slow on GSIBs.
 */
export const Modal = ({ motionPreset, ...rest }: ModalProps) => {
  return <ChakraModal motionPreset={motionPreset || "none"} {...rest} />
}
