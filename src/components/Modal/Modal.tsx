import { Modal as ChakraModal, ModalProps } from "@chakra-ui/react"

export const Modal = ({ motionPreset, ...rest }: ModalProps) => {
  return <ChakraModal motionPreset={motionPreset || "none"} {...rest} />
}
