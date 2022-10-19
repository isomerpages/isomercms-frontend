import {
  Text,
  UnorderedList,
  ListItem,
  Stack,
  useModalContext,
} from "@chakra-ui/react"
import { Button, Link, Checkbox } from "@opengovsg/design-system-react"
import { useFormContext } from "react-hook-form"

import { TEXT_FONT_SIZE } from "../constants"

const TERMS_OF_USE_LINK = "https://v2.isomer.gov.sg" // TODO: Update this when we get it

export const AcknowledgementSubmodalContent = (): JSX.Element => {
  const { watch, register, getValues } = useFormContext()
  const isAcknowledged = watch("isAcknowledged")
  const newCollaboratorEmail = getValues("newCollaboratorEmail")

  const { onClose } = useModalContext()

  return (
    <>
      <Text fontSize={TEXT_FONT_SIZE}>
        <Text as="span">You are adding</Text>
        <Text color="primary.500" as="span">
          {" "}
          {newCollaboratorEmail}{" "}
        </Text>
        <Text as="span">as a collaborator to your site.</Text>
      </Text>
      <br />
      <Text fontSize={TEXT_FONT_SIZE}>
        <Text as="span">This user</Text>
        <Text as="b"> will be able to </Text>
        <Text as="span">
          {" "}
          edit site content and publish it with the approval of a Site Admin,
          but{" "}
        </Text>
        <Text as="b"> will not be able to </Text>
        <Text as="span"> add/remove collaborators, or approve changes.</Text>
      </Text>
      <br />
      <Text fontSize={TEXT_FONT_SIZE}>
        <Text as="span">
          Site Admins and their respective agencies or healthcare institutions
          are responsible for:
        </Text>
      </Text>
      <Text fontSize={TEXT_FONT_SIZE}>
        <UnorderedList ml="24px">
          <ListItem>
            The users they authorise to edit their sites in any manner or
            capacity
          </ListItem>
          <ListItem>All the content published on the sites</ListItem>
        </UnorderedList>
      </Text>
      <br />
      <Text fontSize={TEXT_FONT_SIZE}>
        <Text as="span">
          GovTech will not be held liable for content published by any user that
          has been granted access/allowed to retain access by a Site Admin.
        </Text>
      </Text>
      <br />
      <Checkbox {...register("isAcknowledged")}>
        <Text color="text.body" fontSize="16px">
          <Text as="span">I agree to Isomer&lsquo;s</Text>{" "}
          <Link href={TERMS_OF_USE_LINK} target="_blank">
            Terms of Use
          </Link>
        </Text>
      </Checkbox>
      <Stack spacing={4} direction="row" justify="right">
        <Button variant="clear" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button isDisabled={!isAcknowledged} type="submit">
          Continue
        </Button>
      </Stack>
    </>
  )
}
