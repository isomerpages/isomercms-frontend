import type { ModalProps } from "@chakra-ui/react"

export const Modal = ({ motionPreset, ...rest }: ModalProps) => {
  return <Modal motionPreset={motionPreset || "none"} {...rest} />
}
