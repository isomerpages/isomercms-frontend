import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  VStack,
  HStack,
  ModalProps,
  Box,
  useClipboard,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react"
import { Button, ModalCloseButton } from "@opengovsg/design-system-react"
import { ButtonLink } from "components/ButtonLink"
import _ from "lodash"
import { BiCopy, BiMailSend } from "react-icons/bi"
import Select from "react-select"

import { User } from "types/reviewRequest"

const generateEmailToAdmins = (
  admins: User[],
  siteName: string,
  reviewUrl: string,
  reviewTitle: string
): string => {
  // NOTE: We are guaranteed the existence of at least 1 admin
  // as the invariant for them to get to this step is to select
  // their reviewers.
  const to = admins[0].value
  const cc = admins.slice(1).map(({ value }) => value)
  const subject = `New review request for ${siteName}`
  // NOTE: %0D is a newline. Using \n does not work, possibly because
  // the body portion is interpreted as text/plain
  const body = `I’ve asked you to review changes to my site!%0D%0D

Request title: ${reviewTitle}%0D
View it on IsomerCMS: ${reviewUrl}`

  return `mailto:${to}${cc.length > 0 ? `?cc=${cc}` : ""}&subject=${encodeURI(
    subject
  )}&body=${body}`
}

export interface SendRequestModalProps extends ModalProps {
  admins: User[]
  reviewUrl: string
  reviewTitle: string
  siteName: string
}

export const SendRequestModal = ({
  admins,
  reviewUrl,
  reviewTitle,
  siteName,
  ...props
}: SendRequestModalProps): JSX.Element => {
  const { onCopy, hasCopied } = useClipboard(reviewUrl)
  const sortedAdmins = _.sortBy(admins, (user) => user.label)
  const displayedAdmins = sortedAdmins.slice(0, 2)
  const remainingAdmins = sortedAdmins.slice(2)

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text textStyle="h4">Send Review Request</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* NOTE: Setting pb because using the ModalFooter results in an overly large bottom margin */}
          <VStack spacing="2rem" w="100%" pb="2rem">
            <VStack spacing="0.75rem" align="flex-start" w="100%">
              <Text textStyle="subhead-1" color="text.label">
                Email reviewers a link to your request
              </Text>
              <HStack spacing="0.5rem" w="100%">
                <Select
                  value={displayedAdmins}
                  options={remainingAdmins}
                  isMulti
                  isClearable={false}
                  components={{
                    Input: () =>
                      remainingAdmins.length > 0 ? (
                        <Text
                          ml="0.25rem"
                          textDecoration="underline"
                          color="text.link.default"
                          textStyle="body-2"
                        >{`+${remainingAdmins.length} more`}</Text>
                      ) : null,
                  }}
                  styles={{
                    // NOTE: Setting fixed height so that it is same size as button
                    container: (base) => ({
                      ...base,
                      width: "100%",
                      height: "2.75rem",
                    }),
                    control: (base) => ({ ...base, height: "100%" }),
                    multiValueRemove: (base) => ({ ...base, display: "none" }),
                  }}
                />
                <ButtonLink
                  leftIcon={<BiMailSend fontSize="1.25rem" fill="white" />}
                  href={generateEmailToAdmins(
                    admins,
                    siteName,
                    reviewUrl,
                    reviewTitle
                  )}
                >
                  <Text textColor="white">Open mail app</Text>
                </ButtonLink>
              </HStack>
            </VStack>
            <VStack w="100%" align="flex-start" spacing="0.75rem">
              <Text textStyle="subhead-1" color="text.label">
                Or copy and share this request link with reviewers
              </Text>
              <HStack spacing="0.5rem" w="100%">
                <Box
                  py="0.625rem"
                  pl="1rem"
                  w="100%"
                  border="1px solid"
                  borderColor="border.input.default"
                  borderRadius="4px"
                >
                  <Text textStyle="body-1">{reviewUrl}</Text>
                </Box>
                {/* Closes after 1.5s and does not refocus on the button to avoid the outline */}
                <Popover returnFocusOnClose={false} isOpen={hasCopied}>
                  <PopoverTrigger>
                    <Button
                      onClick={onCopy}
                      variant="outline"
                      leftIcon={<BiCopy fontSize="1.25rem" />}
                    >
                      Copy
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    bg="background.action.alt"
                    _focus={{
                      boxShadow: "none",
                    }}
                    w="fit-content"
                    border="none"
                  >
                    <PopoverArrow bg="background.action.alt" />
                    <PopoverBody>
                      <Text textStyle="body-2" color="text.inverse">
                        Link copied!
                      </Text>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </HStack>
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
