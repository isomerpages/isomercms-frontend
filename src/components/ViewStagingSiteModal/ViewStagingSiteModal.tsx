import {
  HStack,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  VStack,
  Text,
  Image,
} from "@chakra-ui/react"
import { Button, ModalCloseButton } from "@opengovsg/design-system-react"
import QRCode from "qrcode"
import { useEffect, useState } from "react"

import { ButtonLink } from "components/ButtonLink"
import { Modal } from "components/Modal"

import { useStagingLink } from "hooks/useStagingLink"

export interface ViewStagingSiteModalProps {
  isOpen: boolean
  onClose: () => void
  isLoading: boolean
  stagingUrl: string | undefined
  editMode: boolean
}

const GenerateQr = ({ text }: { text: string }) => {
  const [dataURL, setDataURL] = useState<string | null>(null)

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(text)
        setDataURL(url)
      } catch (err) {
        console.error(err)
      }
    }

    generateQR()
  }, [text])

  return (
    <>
      {dataURL ? (
        <Image src={dataURL} width="12.5rem" height="12.5rem" alt="QR code" />
      ) : null}
    </>
  )
}

export function ViewStagingSiteModal({
  isOpen,
  onClose,
  isLoading,
  stagingUrl,
  editMode,
}: ViewStagingSiteModalProps) {
  const stagingLink = useStagingLink(stagingUrl)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mb="0.5rem"> Open staging site</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="1.5rem">
            {editMode ? (
              <Text textStyle="body-1">
                Your changes may take some time to be reflected. Refresh your
                staging site to see if your changes have been built.
              </Text>
            ) : (
              <></>
            )}
            <Text textStyle="body-1">
              You can also scan the QR code below with your mobile phone to see
              what your site may look like on smaller devices:
            </Text>

            <GenerateQr text={stagingLink || ""} />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack w="100%" spacing={2} justifyContent="flex-end">
            <Button variant="clear" onClick={onClose}>
              Close
            </Button>
            <Skeleton isLoaded={!isLoading}>
              <ButtonLink href={stagingLink}>
                <Text color="white">Open staging site in a new tab</Text>
              </ButtonLink>
            </Skeleton>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
