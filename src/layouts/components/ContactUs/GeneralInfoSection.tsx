import { FormControl, Flex, Icon, Text } from "@chakra-ui/react"
import {
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"
import { BiInfoCircle } from "react-icons/bi"

import { Editable } from "components/Editable"

import { useEditableContext } from "contexts/EditableContext"

type GeneralInfoFrontMatter = {
  agency_name: string
}

type FooterContentFrontMatter = {
  feedback: string
}

type GeneralInfoSectionProps = {
  frontMatter: GeneralInfoFrontMatter
  footerContent: FooterContentFrontMatter
  errors: GeneralInfoFrontMatter & FooterContentFrontMatter
}

export const GeneralInfoSection = ({
  frontMatter,
  footerContent,
  errors,
}: GeneralInfoSectionProps) => {
  const { onChange } = useEditableContext()

  return (
    <Editable.EditableAccordionItem
      title="General Information"
      isInvalid={!!errors.agency_name || !!errors.feedback}
    >
      <Editable.Section spacing="1.25rem" pb="1.25rem">
        <FormControl isRequired isInvalid={!!errors.agency_name}>
          <FormLabel>Name of Organisation / Agency</FormLabel>
          <Input
            // TODO: Remove the `id/onChange`
            // and change to react hook forms
            id="header-agency_name"
            onChange={onChange}
            value={frontMatter.agency_name || ""}
            placeholder="Your organisation name"
          />
          <FormErrorMessage>{errors.agency_name}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.feedback}>
          <FormLabel>Link to Feedback Form</FormLabel>
          <Input
            placeholder="Insert a link here"
            id="feedback"
            value={footerContent.feedback || ""}
            onChange={onChange}
          />
          {errors.feedback ? (
            <FormErrorMessage>{errors.feedback}</FormErrorMessage>
          ) : (
            <Flex flexDir="row" mt="0.75rem">
              <Icon
                as={BiInfoCircle}
                fill="base.content.brand"
                mr="0.5rem"
                fontSize="1rem"
              />
              <Text textStyle="caption-2" color="base.content.medium">
                <Text as="span">
                  This is optional and appears at the bottom of your Contact Us
                  page. If you don&apos;t have a feedback form, you can use
                </Text>
                <Text as="span" fontWeight="bold">
                  {" "}
                  Form.gov.sg{" "}
                </Text>
                <Text as="span">to create one.</Text>
              </Text>
            </Flex>
          )}
        </FormControl>
      </Editable.Section>
    </Editable.EditableAccordionItem>
  )
}
