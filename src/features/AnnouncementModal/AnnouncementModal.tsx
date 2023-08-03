import {
  Flex,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  ModalBody,
  Stack,
  Link,
  Box,
} from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { useMemo, useState } from "react"
import { BiRightArrowAlt } from "react-icons/bi"

import { ProgressIndicator } from "components/ProgressIndicator"

import { useAnnouncements } from "hooks/useAnnouncement"

import { Announcement } from "types/announcements"

import { NewFeatureTag } from "./components/NewFeatureTag"

interface AnnouncementModalProps {
  isOpen: boolean
  onClose: () => void
  announcements: Announcement[]
  link: string
}

export const AnnouncementModal = ({
  isOpen,
  announcements,
  onClose,
  link,
}: AnnouncementModalProps): JSX.Element => {
  const [currActiveIdx, setCurrActiveIdx] = useState<number>(0)
  const { setLastSeenAnnouncement } = useAnnouncements()
  const isLastAnnouncement = useMemo(
    () => currActiveIdx === announcements.length - 1,
    [announcements.length, currActiveIdx]
  )

  const handleNextClick = () => {
    if (isLastAnnouncement) {
      setLastSeenAnnouncement()
      onClose()
    }

    setCurrActiveIdx(Math.min(currActiveIdx + 1, announcements.length - 1))
  }

  if (announcements.length < 1) return <></>

  const { title, description, image, tags } = announcements[currActiveIdx]

  return (
    <Modal
      isOpen={isOpen && announcements.length > 0}
      onClose={() => {
        setLastSeenAnnouncement()
        onClose()
      }}
      size="md"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <Box
          width="100%"
          h="4.5rem"
          bg="base.canvas.brandLight"
          borderRadius="4px"
        />
        <Image bg="base.canvas.brandLight" as={image} />
        <ModalHeader>
          {tags.map((tagVariant) => {
            switch (tagVariant) {
              case "New Feature":
                return <NewFeatureTag />
              default: {
                const unimplVariant: never = tagVariant
                throw new Error(
                  `Unimplemented tag variant found: ${unimplVariant}`
                )
              }
            }
          })}
          <Text mt="0.625rem">{title}</Text>
        </ModalHeader>
        <ModalBody whiteSpace="pre-wrap">
          <Text textStyle="body-1" color="base.content.default">
            {description}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Stack
            direction="row"
            width="100vw"
            alignItems="center"
            justifyContent="space-between"
            spacing="2rem"
          >
            <ProgressIndicator
              numIndicators={announcements.length}
              currActiveIdx={currActiveIdx}
              onClick={setCurrActiveIdx}
            />
            {isLastAnnouncement ? (
              <Flex gap="1.5rem" alignItems="center">
                <Link isExternal href={link}>
                  See release notes
                </Link>
                <Button onClick={handleNextClick}>Done</Button>
              </Flex>
            ) : (
              <Button
                rightIcon={<BiRightArrowAlt size="1.5rem" />}
                onClick={handleNextClick}
              >
                Next
              </Button>
            )}
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
