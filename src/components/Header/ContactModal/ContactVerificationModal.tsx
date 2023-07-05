import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { ModalCloseButton } from "@opengovsg/design-system-react"
import { useState } from "react"

import { useLoginContext } from "contexts/LoginContext"

import { useUpdateContact, useVerifyContact } from "hooks/miscHooks"

import { getAxiosErrorMessage } from "utils/axios"

import { ContactOtpProps } from "types/contact"
import { useSuccessToast } from "utils"

import { ContactOtpForm } from "./ContactOtpForm"
import { ContactProps, ContactSettingsForm } from "./ContactSettingsForm"

interface ContactVerificationModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ContactVerificationModal = ({
  isOpen,
  onClose,
}: ContactVerificationModalProps): JSX.Element => {
  const successToast = useSuccessToast()
  const { mutateAsync: sendContactOtp, error: updateError } = useUpdateContact()

  const {
    mutateAsync: verifyContactOtp,
    error: verifyError,
  } = useVerifyContact()

  const { verifyLoginAndGetUserDetails } = useLoginContext()

  const [mobile, setMobile] = useState<string>("")

  const handleSendOtp = async ({ mobile: mobileInput }: ContactProps) => {
    await sendContactOtp({ mobile: mobileInput }) // Non-2xx responses will be caught by axios and thrown as error
    successToast({
      id: "send-otp-success",
      description: `OTP sent to ${mobileInput}`,
    })
    setMobile(mobileInput)
  }

  const handleVerifyOtp = async ({ otp }: ContactOtpProps) => {
    await verifyContactOtp({ mobile, otp })
    onClose()
    successToast({
      id: "verify-otp-success",
      description: `Successfully changed contact number to ${mobile}!`,
    })
    verifyLoginAndGetUserDetails()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader color="text.label">Edit emergency contact</ModalHeader>
        <ModalBody whiteSpace="pre-line" pb="3.25rem">
          <Text color="text.description" pb="1rem">
            Update your mobile number and verify it so we can contact you in the
            unlikely case of an urgent issue. This number can be changed at any
            time in your user settings.
          </Text>
          {mobile ? (
            <ContactOtpForm
              contactNumber={mobile}
              onSubmit={handleVerifyOtp}
              errorMessage={
                getAxiosErrorMessage(updateError) ||
                getAxiosErrorMessage(verifyError)
              }
            />
          ) : (
            <ContactSettingsForm
              onSubmit={handleSendOtp}
              errorMessage={getAxiosErrorMessage(updateError)}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
