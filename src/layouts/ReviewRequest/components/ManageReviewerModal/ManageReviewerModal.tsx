import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalProps,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Button, ModalCloseButton } from "@opengovsg/design-system-react"
import _ from "lodash"
import Select from "react-select"

import { User } from "types/reviewRequest"

export interface ManageReviewerModalProps extends ModalProps {
  selectedAdmins: User[]
  admins: User[]
}

export const ManageReviewerModal = ({
  selectedAdmins,
  admins,
  ...props
}: ManageReviewerModalProps): JSX.Element => {
  const { onClose } = props
  const remainingAdmins = _.difference(admins, selectedAdmins)

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text textStyle="h4" color="text.title.alt">
            Manage Reviewers
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing="0.75rem" align="flex-start">
            <Text textStyle="subhead-1">
              Add or remove Admins who can approve this request
            </Text>
            <Select
              defaultValue={selectedAdmins}
              options={admins}
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
                // NOTE: Don't allow removal if there is only 1 selected admin
                multiValueRemove: (base, state) => {
                  return { ...base, display: "none" }
                },
              }}
            />
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="clear" mr="1rem" onClick={onClose}>
            Cancel
          </Button>
          <Button>Save</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
