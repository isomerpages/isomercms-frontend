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
import Select, { PropsValue, useStateManager } from "react-select"

import { User } from "types/reviewRequest"

export interface ManageReviewerModalProps extends Omit<ModalProps, "children"> {
  selectedAdmins: User[]
  admins: User[]
}

// NOTE: This is with reference to
// https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/types.ts
// The initial type is PropsValue, which is either a single value or a multi-value.
// We need to narrow the type ourself to prove to the TS compiler that this is a list.
const isList = (admins: PropsValue<unknown>): admins is unknown[] => {
  // NOTE: Required as SingleValue can be null
  if (!admins) {
    return false
  }

  return !!(admins as User[]).length
}

export const ManageReviewerModal = ({
  selectedAdmins,
  admins,
  ...props
}: ManageReviewerModalProps): JSX.Element => {
  const { onClose } = props

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
            <AdminsMultiSelect
              admins={admins}
              selectedAdmins={selectedAdmins}
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

const AdminsMultiSelect = ({
  admins,
  selectedAdmins,
}: Pick<ManageReviewerModalProps, "admins" | "selectedAdmins">) => {
  const { value: updatedSelectedAdmins, ...rest } = useStateManager({
    defaultValue: selectedAdmins,
    options: admins,
    isMulti: true,
    isClearable: false,
  })

  const selectedAdminsList = isList(updatedSelectedAdmins)
    ? updatedSelectedAdmins
    : []
  const remainingAdmins = _.difference(admins, selectedAdminsList)

  return (
    <Select
      value={updatedSelectedAdmins}
      {...rest}
      components={{
        Input: () =>
          remainingAdmins.length > 1 ? (
            <Text
              ml="0.25rem"
              textDecoration="underline"
              color="text.link.default"
              textStyle="body-2"
            >{`+${remainingAdmins.length - 1} more`}</Text>
          ) : null,
      }}
      styles={{
        // NOTE: Setting minimum height so that it is same size as button
        container: (base) => ({
          ...base,
          width: "100%",
          minHeight: "2.75rem",
        }),
        control: (base) => ({ ...base, height: "100%" }),
        // NOTE: Don't allow removal if there is only 1 selected admin
        multiValueRemove: (base) => {
          const canRemove = selectedAdminsList.length > 1
          return { ...base, display: canRemove ? "inherit" : "none" }
        },
      }}
    />
  )
}
