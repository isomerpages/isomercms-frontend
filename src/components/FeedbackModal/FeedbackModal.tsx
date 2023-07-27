import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Heading,
} from "@chakra-ui/react"
import { ModalCloseButton } from "@opengovsg/design-system-react"

const FeedbackForm = () => {
  return (
    <>
      <div
        style={{
          fontFamily: "sans-serif",
          fontSize: "15px",
          color: "#000",
          opacity: "0.9",
          paddingTop: "5px",
          paddingBottom: "8px",
        }}
      >
        If the form below is not loaded, you can also fill it in{" "}
        <a href="https://form.gov.sg/64b7a11823e54700118bad90">here</a>.
      </div>

      <iframe
        title="FormSG Feedback form for Isomer"
        id="iframe"
        src="https://form.gov.sg/64b7a11823e54700118bad90"
        width="100%"
        height="650px"
      />

      <div
        style={{
          fontFamily: "sans-serif",
          fontSize: "12px",
          color: "#999",
          opacity: "0.5",
          paddingTop: "5px",
        }}
      >
        Powered by{" "}
        <a href="https://form.gov.sg" color="#999">
          Form
        </a>
      </div>
    </>
  )
}

export interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
}
export const FeedbackModal = ({
  isOpen,
  onClose,
}: FeedbackModalProps): JSX.Element => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading as="h4">Help make Isomer better!</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FeedbackForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
