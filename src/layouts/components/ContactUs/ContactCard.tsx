import { FormControl, Flex, Select } from "@chakra-ui/react"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"
import _ from "lodash"
import { ChangeEvent, useState } from "react"

import { useEditableContext } from "contexts/EditableContext"

import { Editable } from "../Editable"

type PhonePrefix = "singapore" | "toll-free"

export type ContactCardFrontMatter = {
  content: Array<
    | {
        phone: string
      }
    | {
        email: string
      }
    | {
        other: string
      }
  >
  title: string
}

type ContactCardProps = {
  index: number
  frontMatter: ContactCardFrontMatter
  errors: ContactCardFrontMatter
}

const PHONE_PREFIXES: Record<PhonePrefix, string> = {
  singapore: "+65",
  "toll-free": "1800",
}

const PHONE_PLACEHOLDER: Record<PhonePrefix, string> = {
  singapore: "A valid Singapore number",
  "toll-free": "A valid toll-free number",
}

const PHONE_FORMATTING_REGEX: Record<PhonePrefix, RegExp> = {
  singapore: /^(\+65)?\s?(\d{4})?\s?(\d{4})?$/,
  "toll-free": /^(1800)?\s?(\d{3})?\s?(\d{4})?$/,
}

const getHasErrors = (errors: ContactCardFrontMatter) => {
  return (
    _.some(errors.content[0]) ||
    _.some(errors.content[1]) ||
    _.some(errors.content[2]) ||
    !!errors.title
  )
}

export const ContactCard = ({
  index,
  frontMatter,
  errors,
}: ContactCardProps) => {
  const { onChange, onDelete } = useEditableContext()

  const [phonePrefix, setPhonePrefix] = useState<PhonePrefix>(
    "phone" in frontMatter.content[0] &&
      frontMatter.content[0].phone.startsWith(PHONE_PREFIXES["toll-free"])
      ? "toll-free"
      : "singapore"
  )
  const [phoneNumber, setPhoneNumber] = useState<string>(
    "phone" in frontMatter.content[0] &&
      frontMatter.content[0].phone.startsWith(PHONE_PREFIXES[phonePrefix])
      ? frontMatter.content[0].phone
          .slice(PHONE_PREFIXES[phonePrefix].length)
          .trim()
      : ""
  )

  const updatePhoneNumberPrefix = (event: ChangeEvent<HTMLSelectElement>) => {
    setPhonePrefix(event.target.value as PhonePrefix)
    // Reset the input box to be empty
    setPhoneNumber("")
    onChange({
      target: {
        id: `contacts-${index}-phone-0`,
        value: "",
      },
    })
  }

  const updatePhoneNumber = (event: ChangeEvent<HTMLInputElement>) => {
    // Format the phone number actively
    // Add spaces after the country code, and after 4 digits
    // e.g. +65 1234 5678
    // e.g. 1800 123 4567
    const formattedPhoneNumber = `${PHONE_PREFIXES[phonePrefix]}${event.target.value}`
      .replace(/[\s-]/, "")
      .replace(PHONE_FORMATTING_REGEX[phonePrefix], (substring, g1, g2, g3) => {
        return [g1, g2, g3].join(" ")
      })

    onChange({
      target: {
        id: `contacts-${index}-phone-0`,
        value:
          formattedPhoneNumber.slice(PHONE_PREFIXES[phonePrefix].length).trim()
            .length > 0
            ? formattedPhoneNumber
            : "",
      },
    })
    setPhoneNumber(
      formattedPhoneNumber.slice(PHONE_PREFIXES[phonePrefix].length).trim()
    )
  }

  return (
    <Editable.DraggableAccordionItem
      index={index}
      title={frontMatter.title || "New Contact Information"}
      draggableId={`contacts-${index}`}
      isInvalid={getHasErrors(errors)}
    >
      <Editable.Section mt="-0.5rem">
        {/* Contact Information label */}
        <FormControl isRequired isInvalid={!!errors.title}>
          <FormLabel mt="0.25rem">Label</FormLabel>
          <Input
            // TODO: Remove the `id/onChange`
            // and change to react hook forms
            id={`contacts-${index}-title`}
            onChange={onChange}
            value={frontMatter.title || ""}
            placeholder="This is a title for your contact info"
          />
          <FormErrorMessage>{errors.title}</FormErrorMessage>
        </FormControl>

        {/* Contact Information phone */}
        <FormControl
          isRequired
          isInvalid={
            "phone" in errors.content[0] && _.some(errors.content[0].phone)
          }
        >
          <FormLabel mb={2}>Phone</FormLabel>
          <Flex>
            <Select
              onChange={updatePhoneNumberPrefix}
              size="md"
              width="8.625rem"
              height="2.75rem"
              borderColor="base.divider.strong"
              _hover={{ borderColor: "" }}
              isInvalid={false}
              mr={2}
            >
              {Object.entries(PHONE_PREFIXES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Select>
            <Input
              // TODO: Remove the `id/onChange`
              // and change to react hook forms
              id={`contacts-${index}-phone-0`}
              onChange={updatePhoneNumber}
              value={phoneNumber || ""}
              placeholder={PHONE_PLACEHOLDER[phonePrefix]}
            />
          </Flex>

          <FormErrorMessage>
            {"phone" in errors.content[0] && errors.content[0].phone}
          </FormErrorMessage>
        </FormControl>

        {/* Contact Information email */}
        <FormControl
          isRequired
          isInvalid={
            !!("email" in errors.content[1] && errors.content[1].email)
          }
        >
          <FormLabel mb="0.5rem">Email</FormLabel>
          <Input
            // TODO: Remove the `id/onChange`
            // and change to react hook forms
            id={`contacts-${index}-email-1`}
            onChange={onChange}
            value={
              ("email" in frontMatter.content[1] &&
                frontMatter.content[1].email) ||
              ""
            }
            placeholder="enquiries@example.gov.sg"
          />
          <FormErrorMessage>
            {"email" in errors.content[1] && errors.content[1].email}
          </FormErrorMessage>
        </FormControl>

        {/* Contact Information notes */}
        <FormControl
          isInvalid={
            !!("other" in errors.content[2] && errors.content[2].other)
          }
        >
          <FormLabel mb="0.5rem">Notes</FormLabel>
          <Input
            // TODO: Remove the `id/onChange`
            // and change to react hook forms
            id={`contacts-${index}-other-2`}
            onChange={onChange}
            value={
              ("other" in frontMatter.content[2] &&
                frontMatter.content[2].other) ||
              ""
            }
            placeholder="This is displayed at the bottom"
          />
          <FormErrorMessage>
            {"other" in errors.content[2] && errors.content[2].other}
          </FormErrorMessage>
        </FormControl>

        <Button
          variant="clear"
          w="100%"
          id={`contacts-${index}`}
          onClick={() => onDelete(`contacts-${index}`, "contact information")}
          alignSelf="center"
          colorScheme="critical"
        >
          Delete contact information
        </Button>
      </Editable.Section>
    </Editable.DraggableAccordionItem>
  )
}
